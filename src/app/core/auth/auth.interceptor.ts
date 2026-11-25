import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';
import { AuthTokenService } from './auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(AuthTokenService);
  const router = inject(Router);
  const token = tokens.token();

  const request =
    token && req.url.startsWith(environment.apiUrl)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        tokens.clear();
        void router.navigate(['/sign-in']);
      }
      return throwError(() => err);
    }),
  );
};
