import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_PROFILE_ROLE_DETAIL,
  API_URL_PROFILES,
  API_URL_ROLES
} from 'src/app/shared/utilities/constants.utility';
import {
  CreateProfile,
  Profile,
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

  constructor(private readonly http: HttpClient) { }

  getProfileNames(nameSearchDto: string): Observable<Profiles> {
    return this.http.get<Profiles>(`${this.profile_url}/show-by-name/${nameSearchDto}`);
  }

  getRoles(): Observable<Roles> {
    return this.http.get<Roles>(`${this.role_url}/show-all`);
  }

  getProfiles(page: number = 0, pageSize: number = 10): Observable<Profiles> {
    return this.http.get<Profiles>(
      `${this.profile_url}/show-all?page=${page}&size=${pageSize}`
    );
  }

  getProfile(id: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.profile_url}/show-by-id/${id}`
    );
  }

  postProfile(profileData: CreateProfile): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(
      `${this.profile_url}/create`,
      profileData
    );
  }

  putProfile(
    id: number,
    profileData: CreateProfile
  ): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(
      `${this.profile_url}/update/${id}`,
      profileData
    );
  }

  changeStatus(id: number): Observable<Profile> {
    return this.http.patch<Profile>(
      `${this.profile_url}/status-change/${id}`,
      {}
    );
  }

  deleteProfileDetails(id: number): Observable<void> {
    return this.http.delete<void>(`${this.profileDetails_url}/delete/${id}`);
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.profile_url}/delete/${id}`);
  }
}
