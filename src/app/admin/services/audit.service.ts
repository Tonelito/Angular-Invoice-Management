import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_AUDIT } from 'src/app/shared/utilities/constants.utility';
import { cookieUtil } from 'src/app/shared/utilities/storage-utility';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  url = API_URL_AUDIT;
  constructor(private http: HttpClient) {}

  postAudit(auditData: any): Observable<any> {
    const token = cookieUtil.getValue('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.url}/search`, auditData, { headers });
  }
}
