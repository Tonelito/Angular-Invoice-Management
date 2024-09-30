import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_ROLES } from 'src/app/shared/utilities/constants.utility';
import { cookieUtil } from 'src/app/shared/utilities/storage-utility';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  url = API_URL_ROLES;
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.url}s`, { headers });
  }
}
