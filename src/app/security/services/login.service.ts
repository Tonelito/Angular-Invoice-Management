import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = API_URL_SECURITY;
  constructor(private readonly http: HttpClient) {}

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.url}/login`, loginData);
  }
}
