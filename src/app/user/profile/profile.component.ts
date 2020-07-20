import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  image;

  constructor(
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
      this.form.setValue({
        firstName: user.userName, // TODO slice string by ','
        lastName: user.userName,
        email: user.userEmailId,
        mobileNumber: user.userSmsNumber,
        birthday: user.userBirthdate,
        gender: user.userGender,
      });
      this.image = user.userPhoto;
    });
  }

  register(data) {}

  update() {
    this.snackbar.open('User updated', 'Ok', { duration: 3000 });
  }
}
