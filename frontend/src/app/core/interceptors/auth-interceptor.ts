import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.accessToken();
  const isAuthRequest = req.url.includes('/api/auth/');

  const request =
    accessToken && !isAuthRequest
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
      : req.clone({ withCredentials: true });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        req.url.includes('/api/auth/refresh-token') ||
        req.url.includes('/api/auth/login') ||
        req.url.includes('/api/auth/register') ||
        req.url.includes('/api/auth/logout')
      ) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((newToken) => {
          const retriedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
            withCredentials: true,
          });

          return next(retriedRequest);
        }),
        catchError(() => {
          authService.clearSession();
          router.navigateByUrl('/login');
          return throwError(() => error);
        }),
      );
    }),
  );
};
