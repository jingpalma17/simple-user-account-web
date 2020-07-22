import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  isSuccess = false;

  constructor(
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.params.token;
    this.verifyEmailToken(token);
  }

  verifyEmailToken(token) {
    this.userService
      .verifyEmailToken(token)
      .subscribe((isSuccess) => (this.isSuccess = isSuccess));
  }
}
