import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  private getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  login(email, password) {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };
    return this.http
      .post(
        ` ${environment.apiBaseUrl}users/login`,
        { email, password },
        options
      )
      .pipe(
        map((user) => {
          // Store JWT detail
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove jwt from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
