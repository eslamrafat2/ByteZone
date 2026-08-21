import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartPage {
  readonly cartService = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly actionId = signal('');

  constructor() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.loadCart();
  }

  loadCart(): void {
    this.loading.set(true);
    this.cartService.loadCart().subscribe({
      next: () => this.loading.set(false),
      error: error => {
        this.error.set(error?.error?.message || 'Unable to load your cart.');
        this.loading.set(false);
      }
    });
  }

  changeQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.actionId.set(productId);
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => this.actionId.set(''),
      error: error => {
        this.error.set(error?.error?.message || 'Unable to update quantity.');
        this.actionId.set('');
      }
    });
  }

  remove(productId: string): void {
    this.actionId.set(productId);
    this.cartService.removeProduct(productId).subscribe({
      next: () => this.actionId.set(''),
      error: error => {
        this.error.set(error?.error?.message || 'Unable to remove product.');
        this.actionId.set('');
      }
    });
  }


}
