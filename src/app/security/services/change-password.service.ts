import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  url = API_URL_SECURITY;
  constructor(private http: HttpClient) { }

  changePassword(changePasswordData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/change-password`, changePasswordData, { headers });
  }
}