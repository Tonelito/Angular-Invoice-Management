import { CanActivateChildFn } from '@angular/router';

export const onlyDigitsGuard: CanActivateChildFn = (childRoute, state) => {
  return /^\d+$/.test(childRoute.params['id']);
};
