import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class VerificCodeService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) { }

  verifyCode(verifyData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/verific-code`, verifyData, { headers });
  }
}
