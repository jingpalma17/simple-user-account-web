import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private basePath = 'users';
  private accessToken: string = null;

  constructor(private readonly http: HttpClient) {}

  private getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      // Update header
    }

    return headers;
  }

  // TODO Add type
  getAll(): Observable<any> {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };

    return this.http.get(environment.apiBaseUrl + this.basePath, options);
  }

  // TODO change to 'me'
  getProfile(userId): Observable<any> {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };

    return this.http.get(
      environment.apiBaseUrl + `${this.basePath}/${userId}`,
      options
    );
  }

  create(user) {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };

    return this.http.post(
      environment.apiBaseUrl + this.basePath,
      user,
      options
    );
  }

  update(user) {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };
    return this.http.put(
      environment.apiBaseUrl + `${this.basePath}/${user.userId}`,
      user,
      options
    );
  }

  delete(id) {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };
    return this.http.delete(
      environment.apiBaseUrl + `${this.basePath}/${id}`,
      options
    );
  }

  // TODO To be removed?
  login(email, password) {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers }; // TODO Change to json

    return this.http.post(
      environment.apiBaseUrl + this.basePath + '/login',
      { email, password },
      { responseType: 'text' }
    );
  }
}
