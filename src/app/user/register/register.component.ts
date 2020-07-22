import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  register(form) {
    const user = {
      userEmailId: form.email,
      userSmsNumber: form.mobileNumber,
      userPassword: form.password,
      userName: [form.lastName, form.firstName].join(','),
    };
    this.userService.create(user).subscribe(
      (userId) => {
        this.snackbar.open(
          'Please check your email and confirm your registration.',
          'Ok',
          { duration: 3000 }
        );
        this.router.navigate(['/login']);
      },
      (error) =>
        this.snackbar.open('Please try again', 'Ok', { duration: 3000 })
    );
  }
}
