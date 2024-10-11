import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_AUDIT } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  url = API_URL_AUDIT;

  constructor(private readonly http: HttpClient) {}

  postAudit(auditData: any): Observable<any> {
    return this.http.post(`${this.url}/search`, auditData);
  }
}
