import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) {}

  login(body: any) {
    return this.http.post(`${this.url}/login`, JSON.stringify(body));
  }
}
