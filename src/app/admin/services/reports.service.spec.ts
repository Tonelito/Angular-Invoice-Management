import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ReportsService } from './reports.service';
import {
  API_URL_ORDER,
  API_URL_REPORT
} from 'src/app/shared/utilities/constants.utility';

describe('ReportsService', () => {
  let service: ReportsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportsService]
    });
    service = TestBed.inject(ReportsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReports', () => {
    it('should make a GET request with correct parameters', () => {
      const page = 1;
      const size = 10;
      const mockResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0
      };

      service.getReports(page, size).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_ORDER}s-reports?page=${page}&size=${size}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const page = 1;
      const size = 10;
      const errorMessage = 'Internal Server Error';

      service.getReports(page, size).subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(
        `${API_URL_ORDER}s-reports?page=${page}&size=${size}`
      );
      req.flush('', { status: 500, statusText: errorMessage });
    });
  });

  describe('searchReports', () => {
    it('should make a POST request with correct parameters and body', () => {
      const page = 1;
      const size = 10;
      const reportData = { name: 'Test Report' };
      const mockResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0
      };

      service.searchReports(reportData, page, size).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_REPORT}s-by-name?page=${page}&size=${size}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(reportData);
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const page = 1;
      const size = 10;
      const reportData = { name: 'Test Report' };
      const errorMessage = 'Internal Server Error';

      service.searchReports(reportData, page, size).subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(
        `${API_URL_REPORT}s-by-name?page=${page}&size=${size}`
      );
      req.flush('', { status: 500, statusText: errorMessage });
    });
  });
});
