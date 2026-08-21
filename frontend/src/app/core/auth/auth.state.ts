import { Injectable, computed, signal } from '@angular/core';

import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => Boolean(this.user()));

  setUser(user: User | null): void {
    this.user.set(user);
  }

  clearUser(): void {
    this.user.set(null);
  }
}
