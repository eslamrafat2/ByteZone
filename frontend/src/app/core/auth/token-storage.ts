import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'bytezone_access_token';

  getAccessToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(TokenStorage.ACCESS_TOKEN_KEY) ?? '';
  }

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TokenStorage.ACCESS_TOKEN_KEY, token);
  }

  clearAccessToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(TokenStorage.ACCESS_TOKEN_KEY);
  }
}
