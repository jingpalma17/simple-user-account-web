import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mergeMap } from 'rxjs/operators';

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

  verifyEmailToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };
    return this.http.post(
      `${environment.apiBaseUrl}${this.basePath}/verify-email/${token}`,
      {
        token,
      },
      options
    ) as any;
  }

  resendEmailVerification(email: string): Observable<boolean> {
    const headers = new HttpHeaders(this.getHeaders());
    const options = { headers };
    return this.http.post(
      `${environment.apiBaseUrl}${this.basePath}/resend-email-verification`,
      {
        email,
      },
      options
    ) as any;
  }

  getPresignedUrl(fileItem: {
    userId: string;
    url?: string;
    file?: File;
  }): Observable<any> {
    const params = {
      userId: fileItem.userId,
      name: fileItem.file.name,
    };
    return this.http.post(
      `${environment.apiBaseUrl}${this.basePath}` + '/photo-presign',
      params
    );
  }

  uploadPhoto(fileItem: {
    userId: string;
    url?: string;
    file?: File;
  }): Observable<HttpEvent<any>> {
    return this.getPresignedUrl(fileItem).pipe(
      mergeMap((result) => {
        fileItem.url = result.destinationUrl;
        // next upload the file to the AWS S3 bucket
        const request = new HttpRequest(
          'PUT',
          result.signedUrl,
          fileItem.file,
          {
            headers: new HttpHeaders({ 'Content-Type': fileItem.file.type }),
            responseType: 'text',
            reportProgress: true,
          }
        );
        return this.http.request(request);
      })
    );
  }
}
