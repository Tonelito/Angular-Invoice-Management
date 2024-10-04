import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_PROFILE } from 'src/app/shared/utilities/constants.utility';

export interface ProfileResponse {
  note: string;
  object: SectionP[];
}

export interface SectionP {
  profileId: number;
  name: string;
  description: string;
  status: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  url = API_URL_PROFILE;
  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token available');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProfileResponse>(`${this.url}s`, { headers });
  }
}
