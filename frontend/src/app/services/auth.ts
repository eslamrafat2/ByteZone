import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, tap } from 'rxjs';

import { User } from '../shared/models/user.model';
import { API_URL } from '../core/api.config';

interface LoginResponse {
  status: string;
  data: { token: string; name: string; email: string; role: User['role']; };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${API_URL}/auth`;
  private readonly userApiUrl = `${API_URL}/users`;

  readonly accessToken = signal<string>(this.getStoredToken());
  readonly user = signal<User | null>(this.getStoredUser());
  readonly isLoggedIn = computed(() => Boolean(this.accessToken()));

  isAuthenticated(): boolean { return this.isLoggedIn(); }

  login(payload: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload, { withCredentials: true }).pipe(
      tap((response) => {
        const token = response?.data?.token;
        if (!token) return;
        const user: User = { _id: '', name: response.data.name, email: response.data.email, role: response.data.role, createdAt: '', updatedAt: '' };
        this.persistSession(token, user);
      })
    );
  }

  register(payload: { name: string; email: string; password: string }): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/register`, payload, { withCredentials: true });
  }

  logout(): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(finalize(() => this.clearSession()));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ status: string; user: User }>(`${this.userApiUrl}/profile`, { withCredentials: true }).pipe(
      map((response) => response.user),
      tap((user) => {
        if (!user) return;
        this.user.set(user);
        window.localStorage.setItem('bytezone_user', JSON.stringify(user));
      })
    );
  }

  changePassword(payload: { currentPassword: string; newPassword: string }): Observable<{ status: string; message: string }> {
    return this.http.put<{ status: string; message: string }>(`${this.userApiUrl}/password`, payload, { withCredentials: true });
  }

  updateProfile(payload: Partial<Pick<User, 'name' | 'email'>>): Observable<User> {
    return this.http.put<{ status: string; user: User }>(`${this.userApiUrl}/profile`, payload, { withCredentials: true }).pipe(
      map((response) => response.user),
      tap((user) => {
        if (!user) return;
        this.user.set(user);
        if (typeof window !== 'undefined') window.localStorage.setItem('bytezone_user', JSON.stringify(user));
      })
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ status: string; token?: string }>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        if (!response?.token) return;
        this.accessToken.set(response.token);
        window.localStorage.setItem('bytezone_access_token', response.token);
      }),
      map((response) => response.token ?? '')
    );
  }

  clearSession(): void {
    this.accessToken.set('');
    this.user.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('bytezone_access_token');
      window.localStorage.removeItem('bytezone_user');
    }
  }

  goToLogin(): void { this.clearSession(); this.router.navigateByUrl('/login'); }

  private persistSession(token: string, currentUser: User): void {
    this.accessToken.set(token);
    this.user.set(currentUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bytezone_access_token', token);
      window.localStorage.setItem('bytezone_user', JSON.stringify(currentUser));
    }
  }

  private getStoredToken(): string {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('bytezone_access_token') ?? '';
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const rawUser = window.localStorage.getItem('bytezone_user');
    if (!rawUser) return null;
    try { return JSON.parse(rawUser) as User; } catch { return null; }
  }
}
