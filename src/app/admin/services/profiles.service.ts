import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.get<Roles>(`${this.role_url}s`, { headers });
  }

  getProfiles(): Observable<Profiles> {
    const headers = this.getHeaders();
    return this.http.get<Profiles>(`${this.profile_url}/show-all`, { headers });
  }

  getProfile(id: number): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.get<ProfileResponse>(`${this.profile_url}/${id}`, {
      headers
    });
  }

  postProfile(profileData: CreateProfile): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.post<ProfileResponse>(`${this.profile_url}`, profileData, {
      headers
    });
  }

  putProfile(
    id: number,
    profileData: CreateProfile
  ): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.put<ProfileResponse>(
      `${this.profile_url}/${id}`,
      profileData,
      { headers }
    );
  }

  changeStatus(id: number): Observable<ProfileResponse> {
    const headers = this.getHeaders();
    return this.http.patch<ProfileResponse>(`${this.profile_url}/${id}`, {
      headers
    });
  }

  deleteProfileDetails(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.profileDetails_url}/${id}`, {
      headers
    });
  }

  deleteProfile(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.profile_url}/${id}`, { headers });
  }
}
