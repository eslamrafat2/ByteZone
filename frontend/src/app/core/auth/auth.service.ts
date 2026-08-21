import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, tap } from 'rxjs';

import { User } from '../../shared/models/user.model';
import { AuthState } from './auth.state';
import { TokenStorage } from './token-storage';

interface AuthResponse {
  status: string;
  message?: string;
  data?: {
    token: string;
    name: string;
    email: string;
    role: User['role'];
  };
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly authState = inject(AuthState);

  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly userApiUrl = 'http://localhost:3000/api/users';
  private refreshInFlight = false;

  readonly user = this.authState.user;
  readonly isAuthenticated = this.authState.isAuthenticated;

  constructor() {
    const token = this.tokenStorage.getAccessToken();

    if (token) {
      this.getCurrentUser().subscribe({
        next: () => {
          return;
        },
        error: () => {
          this.clearSession();
        }
      });
    }
  }

  register(payload: { name: string; email: string; password: string }): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/register`, payload, {
      withCredentials: true
    });
  }

  login(payload: { email: string; password: string }): Observable<{ status: string; data: { token: string; name: string; email: string; role: User['role'] } }> {
    return this.http.post<{ status: string; data: { token: string; name: string; email: string; role: User['role'] } }>(`${this.apiUrl}/login`, payload, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        if (response?.data?.token) {
          this.tokenStorage.setAccessToken(response.data.token);
        }
      })
    );
  }

  logout(): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      finalize(() => {
        this.clearSession();
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ status: string; user: User }>(`${this.userApiUrl}/profile`, {
      withCredentials: true
    }).pipe(
      map((response) => response.user),
      tap((user) => this.authState.setUser(user))
    );
  }

  updateProfile(payload: Partial<Pick<User, 'name' | 'email'>>): Observable<User> {
    return this.http.put<{ status: string; user: User }>(`${this.userApiUrl}/profile`, payload, {
      withCredentials: true
    }).pipe(
      map((response) => response.user),
      tap((user) => this.authState.setUser(user))
    );
  }

  refreshToken(): Observable<string> {
    if (this.refreshInFlight) {
      return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
        map((response) => {
          const token = response.token ?? '';

          if (token) {
            this.tokenStorage.setAccessToken(token);
          }

          return token;
        })
      );
    }

    this.refreshInFlight = true;

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      map((response) => {
        const token = response.token ?? '';

        if (token) {
          this.tokenStorage.setAccessToken(token);
        }

        return token;
      }),
      finalize(() => {
        this.refreshInFlight = false;
      })
    );
  }

  isRefreshing(): boolean {
    return this.refreshInFlight;
  }

  clearSession(): void {
    this.tokenStorage.clearAccessToken();
    this.authState.clearUser();
  }

  goToLogin(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }
}
