import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_PROFILES,
  API_URL_USER
} from 'src/app/shared/utilities/constants.utility';
import { Users } from '../utilities/models/user.model';
import { CookieUtil } from 'src/app/shared/utilities/storage-utility';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = API_URL_USER;
  url2 = API_URL_PROFILES;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = CookieUtil.getValue('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  addUser(userData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.url}/create`, userData, { headers });
  }
  getUserId(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.url}/search/${id}`, { headers });
  }
  getUsers(page: number, size: number): Observable<Users> {
    const headers = this.getHeaders();
    return this.http.get<Users>(
      `${this.url}/show-all?page=${page}&size=${size}`,
      { headers }
    );
  }
  changeStatus(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.url}/toggle-status/${id}`, {}, { headers });
  }
  putUser(id: number, userData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.url}/update/${id}`, userData, { headers });
  }
}
