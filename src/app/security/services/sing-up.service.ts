import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SingUpService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) { }

  singUp(signUpData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/signup`, signUpData, { headers });
  }
}
