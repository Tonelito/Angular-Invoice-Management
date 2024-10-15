import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_PROFILES,
  API_URL_USER
} from 'src/app/shared/utilities/constants.utility';
import { Users } from '../utilities/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = API_URL_USER;
  url2 = API_URL_PROFILES;
  constructor(private http: HttpClient) { }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.url}/create`, userData);
  }
  getUserId(id: number): Observable<any> {
    return this.http.get(`${this.url}/search/${id}`);
  }
  getUsers(page: number, size: number): Observable<Users> {
    return this.http.get<Users>(
      `${this.url}/show-all?page=${page}&size=${size}`
    );
  }
  getUserByName(userData: any): Observable<Users> {
    return this.http.post<Users>(`${this.url}/search`, userData);
  }
  changeStatus(id: number): Observable<any> {
    return this.http.put(`${this.url}/toggle-status/${id}`, {});
  }
  putUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, userData);
  }
}
