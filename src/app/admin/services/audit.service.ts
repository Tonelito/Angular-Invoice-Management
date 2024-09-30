import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_AUDIT } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  url = API_URL_AUDIT;
  constructor(private http: HttpClient) {}

  postAudit(auditData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/audit`, auditData, { headers });
  }
}
