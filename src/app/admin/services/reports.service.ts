import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_URL_ORDER,
  API_URL_REPORT
} from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private readonly http: HttpClient) {}

  order_url = API_URL_ORDER;
  report_url = API_URL_REPORT;

  getReports(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.order_url}s-reports?page=${page}&size=${size}`
    );
  }

  searchReports(ReportData: any, page: number, size: number): Observable<any> {
    return this.http.post<any>(
      `${this.report_url}s-by-name?page=${page}&size=${size}`,
      ReportData
    );
  }
}
