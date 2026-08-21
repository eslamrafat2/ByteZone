import { Component, inject, signal } from '@angular/core';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-budget-finder',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './budget-finder.html',
  styleUrl: './budget-finder.css',
})
export class BudgetFinder {
  private readonly productService = inject(ProductService);
  readonly budget = signal<number | null>(null);
  readonly category = signal('');
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly searched = signal(false);
  constructor() {
    this.productService
      .getProducts({ page: 1, limit: 1 })
      .subscribe({ next: (r) => this.categories.set(r.categories), error: () => {} });
  }
  findProducts(): void {
    const budget = this.budget();
    if (budget === null || budget <= 0) {
      this.error.set('Enter a valid budget first.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.searched.set(true);
    this.productService
      .getProducts({
        page: 1,
        limit: 100,
        maxPrice: budget,
        category: this.category(),
        availability: 'inStock',
        sort: 'priceDesc',
      })
      .subscribe({
        next: (r) => {
          this.products.set(r.products);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.message || 'Unable to find products.');
          this.loading.set(false);
        },
      });
  }
}
