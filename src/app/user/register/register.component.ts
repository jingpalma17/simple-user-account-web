import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
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
  phonenumber;

  constructor(
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const REGEX_TLD_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.form = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern(REGEX_TLD_EMAIL),
        ]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        mobileNumber: new FormControl(''),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      {
        validators: [
          this.passwordFormatValidator(),
          this.confirmPasswordValidator(),
        ],
      }
    );
  }

  passwordFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password');
      if (password.hasError('required')) {
        return { required: true };
      } else if (password.hasError('minlength')) {
        return { minlength: true };
      } else if (password.hasError('pattern')) {
        return { pattern: true };
      }
    };
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (
        (password.value || confirmPassword.value) &&
        password.value !== confirmPassword.value
      ) {
        confirmPassword.setErrors({ misMatch: true });
        return { misMatch: true };
      }
      confirmPassword.setErrors(null);
    };
  }

  register(form) {
    console.log(form.mobileNumber);
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
        this.snackbar.open(error.error.message, 'Ok', { duration: 3000 })
    );
  }
}
