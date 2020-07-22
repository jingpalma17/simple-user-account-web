import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapService } from '../../map/map.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router } from '@angular/router';

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
  constructor(
    private router: Router,
    private readonly mapService: MapService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });

    const userId = this.authenticationService.currentUserValue.user.userId;
    this.userService.getProfile(userId).subscribe((user) => {
      this.form.setValue({
        firstName: user.userName.split(',')[1],
        lastName: user.userName.split(',')[0],
        mobileNumber: user.userSmsNumber,
        birthdate: user.userBirthdate,
        gender: user.userGender,
      });
      this.image = user.userPhoto;
      this.email = user.userEmailId;
    });
  }

  update(form) {
    const user = {
      userId: this.authenticationService.currentUserValue.user.userId,
      userSmsNumber: form.mobileNumber,
      userGender: form.gender,
      userBirthdate: form.birthdate || null,
      userName: [form.lastName, form.firstName].join(','),
    } as any;
    this.mapService.getIPInfo().subscribe((ipInfo: any) => {
      user.userIp = ipInfo.ip;
      this.userService.update(user).subscribe(
        () => {
          this.snackbar.open('Profile updated', 'Ok', { duration: 3000 });
        },
        () => this.snackbar.open('Please try again.', 'Ok', { duration: 3000 })
      );
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
