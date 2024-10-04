import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_URL_USER } from 'src/app/shared/utilities/constants.utility';

export interface UserResponse {
  note: string;
  object: Section[];
  totalElements: number;
}

export interface Section {
  email: string;
  fullName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ListUserService {

  url = API_URL_USER;

  constructor(private http: HttpClient) { }



  getUsers(page: number, size: number): Observable<UserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserResponse>(`${this.url}s?page=${page}&size=${size}`, { headers });
  }
}
