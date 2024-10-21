import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuditService } from './audit.service';
import { API_URL_AUDIT } from 'src/app/shared/utilities/constants.utility';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditService]
    });
    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call searchAudits with correct URL and data', () => {
    const mockData = { entity: 'Users', fullName: 'John Doe' };
    const page = 0;
    const size = 10;

    service.searchAudits(mockData, page, size).subscribe();

    const req = httpMock.expectOne(
      `${API_URL_AUDIT}/search?page=${page}&size=${size}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
  });

  it('should call getAllAudits with correct URL', () => {
    const page = 0;
    const size = 10;

    service.getAllAudits(page, size).subscribe();

    const req = httpMock.expectOne(
      `${API_URL_AUDIT}/show-all?page=${page}&size=${size}`
    );
    expect(req.request.method).toBe('GET');
  });
});
