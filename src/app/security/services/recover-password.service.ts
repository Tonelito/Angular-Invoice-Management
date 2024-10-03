import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) { }

  passwordRecovery(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { email };

    return this.http.post(`${this.url}/recover-password`,  body , { headers });
  }
}
