import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapService } from '../../map/map.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  userId;
  image;

  constructor(
    private readonly mapService: MapService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });

    this.userService.getProfile().subscribe((user) => {
      this.userId = user.userId;

      this.form.setValue({
        firstName: user.userName.split(',')[1], // TODO slice string by ','
        lastName: user.userName.split(',')[0],
        email: user.userEmailId,
        mobileNumber: user.userSmsNumber,
        birthday: user.userBirthdate,
        gender: user.userGender,
      });
      this.image = user.userPhoto;
    });
  }

  update(form) {
    const user = {
      userId: this.userId,
      userEmailId: form.email,
      userSmsNumber: form.mobileNumber,
      userGender: form.gender,
      userBirthdate: form.birthday || null,
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
}
