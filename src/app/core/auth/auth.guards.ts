import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';

export const authGuard: CanActivateFn = () => {
  const tokens = inject(AuthTokenService);
  if (tokens.isAuthenticated()) return true;
  tokens.clear();
  return inject(Router).createUrlTree(['/sign-in']);
};

export const guestGuard: CanActivateFn = () =>
  inject(AuthTokenService).isAuthenticated() ? inject(Router).createUrlTree(['/personnel']) : true;
