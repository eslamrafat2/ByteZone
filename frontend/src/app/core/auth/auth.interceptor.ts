import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = tokenStorage.getAccessToken();
  const isAuthRequest = req.url.includes('/api/auth/');

  let request = req;

  if (token && !isAuthRequest) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    request = req.clone({ withCredentials: true });
  }

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

      if (authService.isRefreshing()) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((newToken) => {
          const retriedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            },
            withCredentials: true
          });

          return next(retriedRequest);
        }),
        catchError(() => {
          authService.clearSession();
          router.navigateByUrl('/login');
          return throwError(() => error);
        })
      );
    })
  );
};
