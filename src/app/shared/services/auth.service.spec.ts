import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginService } from '../../security/services/login.service';
import { Router } from '@angular/router';
import { DecodeTokenService } from './decode-token.service';
import { CookieUtil } from '../utilities/storage-utility';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;
  let decodeTokenService: jasmine.SpyObj<DecodeTokenService>;

  beforeEach(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const decodeTokenServiceSpy = jasmine.createSpyObj('DecodeTokenService', [
      'DecodeToken'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DecodeTokenService, useValue: decodeTokenServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    decodeTokenService = TestBed.inject(
      DecodeTokenService
    ) as jasmine.SpyObj<DecodeTokenService>;

    router.navigate.and.returnValue(Promise.resolve(true));

    // Clear all storage before each test
    localStorage.clear();
    sessionStorage.clear();
    CookieUtil.removeAll();
  });

  describe('login', () => {
    const mockLoginData = { username: 'test', password: 'test123' };
    const mockToken = 'test-token';
    const mockDecodedToken = {
      user_id: '123',
      authorities: ['ROLE_USER'],
      sub: 'test@example.com',
      exp: '1735689600'
    };

    it('should handle successful login with valid token', done => {
      loginService.login.and.returnValue(of({ token: mockToken }));
      decodeTokenService.DecodeToken.and.returnValue(mockDecodedToken);

      spyOn(CookieUtil, 'storage');
      spyOn(localStorage, 'setItem');

      service.login(mockLoginData).subscribe(() => {
        expect(loginService.login).toHaveBeenCalledWith(mockLoginData);
        expect(decodeTokenService.DecodeToken).toHaveBeenCalledWith(mockToken);
        expect(CookieUtil.storage).toHaveBeenCalledWith(
          'user_id',
          mockDecodedToken.user_id
        );
        expect(CookieUtil.storage).toHaveBeenCalledWith(
          'authorities',
          mockDecodedToken.authorities
        );
        expect(CookieUtil.storage).toHaveBeenCalledWith(
          'sub',
          mockDecodedToken.sub
        );
        expect(CookieUtil.storage).toHaveBeenCalledWith(
          'exp',
          mockDecodedToken.exp
        );
        expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
        expect(router.navigate).toHaveBeenCalledWith(['/admin/home']);
        done();
      });
    });

    it('should handle login response without token', done => {
      spyOn(console, 'error');
      loginService.login.and.returnValue(of({}));

      service.login(mockLoginData).subscribe(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Token not found in response'
        );
        expect(localStorage.getItem('token')).toBeNull();
        done();
      });
    });

    it('should handle failed token decode', done => {
      spyOn(console, 'error');
      loginService.login.and.returnValue(of({ token: mockToken }));
      decodeTokenService.DecodeToken.and.returnValue(null);

      service.login(mockLoginData).subscribe(() => {
        expect(console.error).toHaveBeenCalledWith('Failed to decode token');
        expect(localStorage.getItem('token')).toBeNull();
        done();
      });
    });

    it('should handle login error', done => {
      spyOn(console, 'log');
      const error = new Error('Login failed');
      loginService.login.and.returnValue(throwError(() => error));

      service.login(mockLoginData).subscribe({
        error: () => {
          expect(console.log).toHaveBeenCalledWith('Login error:', error);
          done();
        }
      });
    });
  });

  describe('setToken', () => {
    it('should store valid token in localStorage', () => {
      const token = 'valid-token';
      service['setToken'](token);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should handle null/undefined token', () => {
      spyOn(console, 'error');
      service['setToken']('');
      expect(console.error).toHaveBeenCalledWith(
        'Invalid token: Token is null or undefined'
      );
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getUserFromCookies', () => {
    it('should return parsed user when sub exists', () => {
      const mockUser = { id: 1, name: 'Test User' };
      CookieUtil.storage('sub', JSON.stringify(mockUser));
      expect(service.getUserFromCookies()).toEqual(mockUser);
    });

    it('should return null when sub does not exist', () => {
      expect(service.getUserFromCookies()).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no expiration exists', () => {
      expect(service.isTokenExpired()).toBeTrue();
    });

    it('should return true for expired token', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      CookieUtil.storage('exp', pastTime.toString());
      expect(service.isTokenExpired()).toBeTrue();
    });

    it('should return false for valid token', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      CookieUtil.storage('exp', futureTime.toString());
      expect(service.isTokenExpired()).toBeFalse();
    });
  });

  describe('checkSessionExpiration', () => {
    it('should call logout when token is expired', () => {
      spyOn(service, 'isTokenExpired').and.returnValue(true);
      spyOn(service, 'logout');

      service.checkSessionExpiration();

      expect(service.logout).toHaveBeenCalled();
    });

    it('should not call logout when token is valid', () => {
      spyOn(service, 'isTokenExpired').and.returnValue(false);
      spyOn(service, 'logout');

      service.checkSessionExpiration();

      expect(service.logout).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear storage and navigate to login', async () => {
      CookieUtil.storage('exp', '12345');
      localStorage.setItem('token', 'test-token');

      service.logout();

      expect(CookieUtil.getValue('exp')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/security/login']);
    });
  });
});
