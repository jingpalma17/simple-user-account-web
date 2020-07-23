import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isUserNotVerified;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(form) {
    this.authenticationService.login(form.email, form.password).subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.snackbar.open('Please try again.', 'Ok', { duration: 3000 });
          return;
        }
        this.router.navigate(['/profile']);
      },
      (error) => {
        if (error.status === 400) {
          this.isUserNotVerified = true;
        }
        this.snackbar.open(error.error.message, 'Ok', { duration: 3000 });
      }
    );
  }

  resendEmailVerification(email) {
    this.userService
      .resendEmailVerification(email)
      .subscribe(() =>
        this.snackbar.open('Verification link sent', 'Ok', { duration: 3000 })
      );
    this.isUserNotVerified = false;
  }
}
