import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) { }

  verifyCode(verifyData: any): Observable<any> {
    return this.http.post(`${this.url}/verific-code`, verifyData);
  }

  singUp(signUpData: any): Observable<any> {

    return this.http.post(`${this.url}/signup`, signUpData);
  }
  passwordRecovery(email: string): Observable<any> {

    const body = { email };

    return this.http.post(`${this.url}/recover-password`, body);
  }
  changePassword(changePasswordData: any): Observable<any> {

    return this.http.post(`${this.url}/change-password`, changePasswordData);
  }
}
