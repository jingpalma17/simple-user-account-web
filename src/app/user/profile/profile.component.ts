import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapService } from '../../map/map.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router } from '@angular/router';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, last } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  // TODO combine
  image;
  email;
  photo;
  isPending = false;
  isLoaded = false;

  constructor(
    private router: Router,
    private readonly mapService: MapService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly authenticationService: AuthenticationService
  ) {
    this.photo = { currentUrl: null };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });

    const userId = this.authenticationService.currentUserValue.user.userId;
    this.userService.getProfile(userId).subscribe(
      (user) => {
        if (!user) {
          this.snackbar.open('Please login again.', 'Ok', { duration: 3000 });
          this.logout();
          return;
        }

        this.isLoaded = true;
        this.form.setValue({
          firstName: (user.userName && user.userName.split(',')[1]) || '',
          lastName: (user.userName && user.userName.split(',')[0]) || '',
          mobileNumber: user.userSmsNumber || '',
          birthdate: user.userBirthdate || null,
          gender: user.userGender || null,
        });
        this.photo.currentUrl = user.userPhoto;
        this.email = user.userEmailId;
      },
      () => {
        this.isLoaded = true;
        this.snackbar.open('Please try again.', 'Ok', { duration: 3000 });
        this.logout();
      }
    );
  }

  update(form) {
    this.isPending = true;
    let user = {
      userId: this.authenticationService.currentUserValue.user.userId,
      userSmsNumber: form.mobileNumber,
      userGender: form.gender,
      userBirthdate: form.birthdate || null,
      userName: [form.lastName, form.firstName].join(','),
    } as any;
    this.mapService.getIPInfo().subscribe(
      (ipInfo: any) => {
        user.userIp = ipInfo.ip;

        this.upload(user.userId).subscribe((result) => {
          user = { ...user, userPhoto: this.photo.url };
          this.userService.update(user).subscribe(
            () => {
              this.isPending = false;
              this.snackbar.open('Profile updated', 'Ok', { duration: 3000 });
            },
            () => {
              this.isPending = false;
              this.snackbar.open('Please try again.', 'Ok', { duration: 3000 });
            }
          );
        });
      },
      () => (this.isPending = false)
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  onSelectPhotoFile(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files[0]) {
      this.photo.file = fileEvent.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.photo.file); // read file as data url
      reader.addEventListener(
        'load',
        () => {
          this.photo.currentUrl = reader.result as string;
        },
        false
      );
    }
  }

  upload(userId) {
    if (!this.photo.file) {
      return of(null);
    }
    this.photo.userId = userId;

    return this.userService.uploadPhoto(this.photo).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // Upload started
            break;
          case HttpEventType.UploadProgress:
            // Compute and show the % done:
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.photo.progress = percentDone;
            break;
          case HttpEventType.Response:
            break;
        }
        return event;
      }),
      catchError(async (error: HttpErrorResponse) => {
        this.snackbar.open('Error uploading file.', 'Ok', {
          duration: 5000,
        });
        return of({
          fileItem: this.photo,
          errorMessage: 'Error uploading file.',
        });
      }),
      last() // Emit last value
    );
  }
}
