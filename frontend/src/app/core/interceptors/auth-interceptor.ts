import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const localApiUrl = 'http://localhost:3000';
  const productionApiUrl = 'https://bytezone.onrender.com';

  const isProduction =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const apiRequest =
    isProduction && req.url.startsWith(localApiUrl)
      ? req.clone({
          url: req.url.replace(localApiUrl, productionApiUrl),
        })
      : req;

  const accessToken = authService.accessToken();
  const isAuthRequest = apiRequest.url.includes('/api/auth/');

  const request =
    accessToken && !isAuthRequest
      ? apiRequest.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
      : apiRequest.clone({ withCredentials: true });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        apiRequest.url.includes('/api/auth/refresh-token') ||
        apiRequest.url.includes('/api/auth/login') ||
        apiRequest.url.includes('/api/auth/register') ||
        apiRequest.url.includes('/api/auth/logout')
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
