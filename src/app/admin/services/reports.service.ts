import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_REPORTS } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private readonly http: HttpClient) {}

  report_url = API_URL_REPORTS;

  getReports(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.report_url}/show-all?page=${page}&size=${size}`
    );
  }

  searchReports(ReportData: any, page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.report_url}/search?page=${page}&size=${size}`,
      ReportData
    );
  }
}
