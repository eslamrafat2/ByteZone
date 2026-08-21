import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/models/product.model';
import {
  ProductAvailability,
  ProductService,
  ProductSort,
  ProductsQuery,
} from '../../services/product.service';

type PriceFilter = 'all' | 'under-100' | '100-300' | '300-500' | '500-1000' | '1000-plus';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private requestId = 0;

  readonly currentPage = signal(1);
  readonly pageSize = signal(12);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedBrand = signal('');
  readonly selectedAvailability = signal<ProductAvailability | 'all'>('all');
  readonly selectedPrice = signal<PriceFilter>('all');
  readonly selectedSort = signal<ProductSort>('default');
  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly categories = signal<string[]>([]);
  readonly brands = signal<string[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly hasActiveFilters = computed(
    () =>
      Boolean(this.searchTerm() || this.selectedCategory() || this.selectedBrand()) ||
      this.selectedAvailability() !== 'all' ||
      this.selectedPrice() !== 'all' ||
      this.selectedSort() !== 'default',
  );

  readonly pageNumbers = computed<(number | 'ellipsis')[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('ellipsis');
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  });

 constructor() {
  this.route.queryParamMap.subscribe(params => {
    const search = params.get('search') || '';
    const category = params.get('category') || '';

    const searchChanged = search !== this.searchTerm();
    const categoryChanged = category !== this.selectedCategory();

    if (searchChanged) {
      this.searchTerm.set(search);
    }

    if (categoryChanged) {
      this.selectedCategory.set(category);
    }

    if (searchChanged || categoryChanged) {
      this.currentPage.set(1);
      this.loadProducts();
    } else if (!this.products().length && !this.loading()) {
      this.loadProducts();
    }
  });
}

  setCategory(value: string): void {
    this.selectedCategory.set(value);
    this.resetAndLoad();
  }

  setBrand(value: string): void {
    this.selectedBrand.set(value);
    this.resetAndLoad();
  }

  setAvailability(value: string): void {
    this.selectedAvailability.set(value as ProductAvailability | 'all');
    this.resetAndLoad();
  }

  setPrice(value: string): void {
    this.selectedPrice.set(value as PriceFilter);
    this.resetAndLoad();
  }

  setSort(value: string): void {
    this.selectedSort.set(value as ProductSort);
    this.resetAndLoad();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedAvailability.set('all');
    this.selectedPrice.set('all');
    this.selectedSort.set('default');
    this.router.navigate(['/products'], { queryParams: {} });
    this.resetAndLoad();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    this.loadProducts();
  }

  private resetAndLoad(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  private loadProducts(): void {
    const requestId = ++this.requestId;
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts(this.buildQuery()).subscribe({
      next: (response) => {
        if (requestId !== this.requestId) {
          return;
        }

        this.products.set(response.products);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.categories.set(response.categories);
        this.brands.set(response.brands);
        this.loading.set(false);
      },
      error: () => {
        if (requestId !== this.requestId) {
          return;
        }

        this.errorMessage.set('Unable to load products. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  private buildQuery(): ProductsQuery {
    const query: ProductsQuery = {
      page: this.currentPage(),
      limit: this.pageSize(),
      sort: this.selectedSort(),
    };

    const search = this.searchTerm().trim();

    if (search) {
      query.search = search;
    }

    if (this.selectedCategory()) {
      query.category = this.selectedCategory();
    }

    if (this.selectedBrand()) {
      query.brand = this.selectedBrand();
    }

    const availability = this.selectedAvailability();

    if (availability !== 'all') {
      query.availability = availability;
    }

    Object.assign(query, this.priceRange(this.selectedPrice()));
    return query;
  }

  private priceRange(filter: PriceFilter): Pick<ProductsQuery, 'minPrice' | 'maxPrice'> {
    switch (filter) {
      case 'under-100':
        return { maxPrice: 99.999 };
      case '100-300':
        return { minPrice: 100, maxPrice: 300 };
      case '300-500':
        return { minPrice: 300.001, maxPrice: 500 };
      case '500-1000':
        return { minPrice: 500.001, maxPrice: 1000 };
      case '1000-plus':
        return { minPrice: 1000.001 };
      default:
        return {};
    }
  }
  
}
