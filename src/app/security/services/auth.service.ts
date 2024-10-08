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

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  verifyCode(verifyData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.url}/verific-code`, verifyData, { headers });
  }

  singUp(signUpData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.url}/signup`, signUpData, { headers });
  }
  passwordRecovery(email: string): Observable<any> {
    const headers = this.getHeaders();

    const body = { email };

    return this.http.post(`${this.url}/recover-password`, body, { headers });
  }
  changePassword(changePasswordData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.url}/change-password`, changePasswordData, { headers });
  }
}
