import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_AUDIT,
  API_URL_USER
} from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  url = API_URL_AUDIT;
  user_search_url = API_URL_USER;

  constructor(private readonly http: HttpClient) {}

  postAudit(auditData: any, page: number, size: number): Observable<any> {
    return this.http.post(
      `${this.url}/search?page=${page}&size=${size}`,
      auditData
    );
  }

  searchUser(fullName: string): Observable<any> {
    return this.http.post(`${this.user_search_url}/search`, { fullName });
  }
}
