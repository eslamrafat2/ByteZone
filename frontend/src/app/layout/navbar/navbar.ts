import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  readonly currentUser = this.authService.user;
  readonly isAuthenticated = this.authService.isLoggedIn;
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly userName = computed(() => this.currentUser()?.name || 'User');

  menuOpen = false;
  profileMenuOpen = false;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  searchValue = '';

  onSearchInput(value: string): void {
    this.searchValue = value;

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      const term = this.searchValue.trim();
      this.router.navigate(['/products'], {
        queryParams: term ? { search: term } : {}
      });
    }, 300);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const term = this.searchValue.trim();
    this.router.navigate(['/products'], {
      queryParams: term ? { search: term } : {}
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.profileMenuOpen = false;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login')
    });
    this.closeMenu();
  }
}