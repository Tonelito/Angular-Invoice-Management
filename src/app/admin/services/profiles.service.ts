import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_PROFILE_ROLE_DETAIL,
  API_URL_PROFILES,
  API_URL_ROLES
} from 'src/app/shared/utilities/constants.utility';
import { cookieUtil } from 'src/app/shared/utilities/storage-utility';
import {
  CreateProfile,
  ProfileResponse,
  Profiles,
  Roles
} from '../utilities/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  profile_url = API_URL_PROFILES;
  profileDetails_url = API_URL_PROFILE_ROLE_DETAIL;
  role_url = API_URL_ROLES;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = cookieUtil.getValue('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getRoles(): Observable<Roles> {
    const headers = this.getHeaders();
    return this.http.get<Roles>(`${this.role_url}/show-all`, { headers });
  }

  getProfiles(page: number = 0, pageSize: number = 10): Observable<Profiles> {
    const headers = this.getHeaders();
    return this.http.get<Profiles>(
      `${this.profile_url}/show-all?page=${page}&size=${pageSize}`,
      { headers }
    );
  }

  getProfile(id: number): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.get<ProfileResponse>(
      `${this.profile_url}/show-by-id/${id}`,
      {
        headers
      }
    );
  }

  postProfile(profileData: CreateProfile): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.post<ProfileResponse>(
      `${this.profile_url}/create`,
      profileData,
      {
        headers
      }
    );
  }

  putProfile(
    id: number,
    profileData: CreateProfile
  ): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.put<ProfileResponse>(
      `${this.profile_url}/update/${id}`,
      profileData,
      { headers }
    );
  }

  changeStatus(id: number): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.patch<ProfileResponse>(
      `${this.profile_url}/status-change/${id}`,
      {
        headers
      }
    );
  }

  deleteProfileDetails(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.profileDetails_url}/delete/${id}`, {
      headers
    });
  }

  deleteProfile(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.profile_url}/delete/${id}`, {
      headers
    });
  }
}
