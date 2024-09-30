import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_PROFILE_ROLE_DETAIL } from 'src/app/shared/utilities/constants.utility';
import { cookieUtil } from 'src/app/shared/utilities/storage-utility';

@Injectable({
  providedIn: 'root'
})
export class ProfileRoleDetailsService {
  url = API_URL_PROFILE_ROLE_DETAIL;

  constructor(private http: HttpClient) {}

  postProfileRoleDetails(profileRoleData: any): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.url}`, profileRoleData, { headers });
  }
}
