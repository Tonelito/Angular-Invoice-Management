import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { API_URL_SECURITY } from 'src/app/shared/utilities/constants.utility';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        email: 'test@example.com'
      }
    };

    it('should send POST request to login endpoint', () => {
      service.login(mockLoginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL_SECURITY}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginData);

      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const errorMessage = 'Invalid credentials';

      service.login(mockLoginData).subscribe({
        error: error => {
          expect(error.error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${API_URL_SECURITY}/login`);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
