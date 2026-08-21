import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../shared/models/product.model';
import { CompareService } from '../../../services/compare.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  private readonly compareService = inject(CompareService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly product = input.required<Product>();

  readonly imageAvailable = signal(true);
  readonly localMessage = signal('');
  readonly cartMessage = signal('');

readonly imageUrl = computed(() => {
  const image = this.product().image;

  if (!image) {
    return '';
  }

  if (image.startsWith('/uploads/')) {
    return `http://localhost:3000${image}`;
  }

  if (image.startsWith('uploads/')) {
    return `http://localhost:3000/${image}`;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `/images/products/${image}`;
});

  readonly inCompare = computed(() => this.compareService.isProductInCompare(this.product()._id));

  constructor() {
    effect(() => {
      const currentProductId = this.product()._id;

      if (!this.compareService.isProductInCompare(currentProductId)) {
        this.localMessage.set('');
      }
    });
  }

  onImageError(): void {
    this.imageAvailable.set(false);
  }


  addToCart(): void {
    const product = this.product();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addProduct(product).subscribe({
      next: () => this.cartMessage.set('Added to cart.'),
      error: error => this.cartMessage.set(error?.error?.message || 'Unable to add to cart.')
    });
  }

  toggleCompare(): void {
    const productId = this.product()._id;

    if (this.compareService.isProductInCompare(productId)) {
      this.compareService.removeProduct(productId);
      this.localMessage.set('');
      return;
    }

    const result = this.compareService.addProduct(productId);

    if (result.success) {
      this.localMessage.set('');
      return;
    }

    this.localMessage.set(result.message);
  }
}
