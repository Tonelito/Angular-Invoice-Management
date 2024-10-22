import { Injectable } from '@angular/core';
import { LoginService } from '../../security/services/login.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CookieUtil } from '../utilities/storage-utility';
import { DecodeTokenService } from './decode-token.service';
import * as CONSTS from '../utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token';

  constructor(
    private readonly loginService: LoginService,
    private readonly decodeTokenService: DecodeTokenService,
    private readonly router: Router
  ) {}

  login(loginData: any): Observable<any> {
    return this.loginService.login(loginData).pipe(
      tap({
        next: (response: any) => {
          // Updated to use the new object signature
          const token = response?.token;

          if (!token) {
            console.error('Token not found in response');
            return;
          }

          const decodedToken = this.decodeTokenService.DecodeToken(token);

          if (!decodedToken) {
            console.error('Failed to decode token');
            return;
          }

          CookieUtil.storage('user_id', decodedToken.user_id);
          CookieUtil.storage('authorities', decodedToken.authorities);
          CookieUtil.storage('sub', decodedToken.sub);
          CookieUtil.storage('exp', decodedToken.exp);
          CookieUtil.storage('LAST_ACTIVITY', new Date().getTime());
          this.setToken(token);
          this.router.navigate(['/admin/home']);
        },
        error: error => {
          console.log('Login error:', error);
        }
      })
    );
  }

  private setToken(token: string): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.error('Invalid token: Token is null or undefined');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserFromCookies(): any {
    const userJson = CookieUtil.getValue('sub');
    return userJson ? JSON.parse(userJson) : null;
  }

  public isTokenExpired(): boolean {
    const exp = CookieUtil.getValue(CONSTS.EXP);
    if (!exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return Number(exp) < currentTime;
  }

  public checkSessionExpiration(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  logout(): void {
    CookieUtil.removeAll();
    this.router.navigate(['/security/login']).then();
  }
}
