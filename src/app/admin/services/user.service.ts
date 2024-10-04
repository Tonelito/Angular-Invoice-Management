import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_USER } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = API_URL_USER
  constructor(private http: HttpClient) { }

  addUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.url}`, userData, { headers });
  }
}