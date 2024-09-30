import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_PROFILES } from 'src/app/shared/utilities/constants.utility';
import { cookieUtil } from 'src/app/shared/utilities/storage-utility';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  url = API_URL_PROFILES;

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.url}s`, { headers });
  }

  postProfile(profileData: any): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.url}`, profileData, { headers });
  }

  deleteProfile(id: number): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
