import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private readonly http: HttpClient) {}

  getIPInfo() {
    return this.http.get('https://ipapi.co/json/');
  }
}
