import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_USER } from 'src/app/shared/utilities/constants.utility';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserIdService {
  url = API_URL_USER;
  constructor(private http: HttpClient) { }

  getUserId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.url}/${id}`, { headers });
  }
}
