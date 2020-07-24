import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { AuthGuard } from './auth/auth.guard';
import { NotLoggedInGuard } from './auth/not-logged-in.guard';
import { EmailConfirmationComponent } from './user/email-confirmation/email-confirmation.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'login',
    canActivate: [NotLoggedInGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [NotLoggedInGuard],
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    canActivate: [NotLoggedInGuard],
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify-email/:token',
    canActivate: [NotLoggedInGuard],
    component: EmailConfirmationComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
