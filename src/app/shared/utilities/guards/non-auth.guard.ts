import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieUtil } from '../storage-utility';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = getUserFromCookies();

  if (!user) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

function getUserFromCookies(): any {
  const userJson = CookieUtil.getValue('sub');
  return userJson ? JSON.parse(userJson) : null;
}

export const nonAuthChildGuard: CanActivateChildFn = (route, state) => {
  return nonAuthGuard(route, state);
};
