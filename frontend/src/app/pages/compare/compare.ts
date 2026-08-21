import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CompareService } from '../../services/compare.service';
import { Product } from '../../shared/models/product.model';

@Component({
    selector: 'app-compare',
    standalone: true,
    imports: [CurrencyPipe, RouterLink],
    templateUrl: './compare.html',
    styleUrl: './compare.css'
})
export class ComparePage {
    private readonly productService = inject(ProductService);
    private readonly compareService = inject(CompareService);
    private readonly cartService = inject(CartService);

    readonly products = signal<Product[]>([]);
    readonly loading = signal(false);
    readonly errorMessage = signal('');

    readonly selectedIds = this.compareService.selectedIds;
    readonly compareCount = this.compareService.compareCount;

    readonly comparisonKeys = computed(() => {
        const entries = this.products();

        if (!entries.length) {
            return [] as string[];
        }

        const keys = new Set<string>();

        entries.forEach((product) => {
            Object.keys(product.specifications ?? {}).forEach((key) => keys.add(key));
        });

        return Array.from(keys);
    });

    constructor() {
        this.loadProducts();
    }

    formatSpecLabel(key: string): string {
        return key
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    formatSpecValue(value: unknown): string {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        if (Array.isArray(value)) {
            return value.length ? value.map((item) => this.formatSpecValue(item)).join(', ') : '—';
        }

        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch {
                return '—';
            }
        }

        return String(value);
    }

    normalizeSpecValue(value: unknown): string {
        const normalized = this.formatSpecValue(value);
        return normalized === '—' ? '' : normalized.toLowerCase();
    }

    isValueDifferent(key: string): boolean {
        const values = this.products()
            .map((product) => this.normalizeSpecValue(product.specifications?.[key]))
            .filter((value) => value !== '');

        if (values.length <= 1) {
            return false;
        }

        return new Set(values).size > 1;
    }

    isRowDifferent(values: unknown[]): boolean {
        const normalizedValues = values
            .map((value) => this.normalizeSpecValue(value))
            .filter((value) => value !== '');

        if (normalizedValues.length <= 1) {
            return false;
        }

        return new Set(normalizedValues).size > 1;
    }

    addToCart(product: Product): void {
        this.cartService.addProduct(product).subscribe();
    }

    isInCart(productId: string): boolean {
        return this.cartService.isInCart(productId);
    }

    removeProduct(productId: string): void {
        this.compareService.removeProduct(productId);
        this.loadProducts();
    }

    clearCompare(): void {
        this.compareService.clear();
        this.loadProducts();
    }

    private loadProducts(): void {
        const ids = this.compareService.selectedIds();

        if (!ids.length) {
            this.products.set([]);
            this.errorMessage.set('');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.productService.compareProducts(ids).subscribe({
            next: (response) => {
                this.products.set(response.products || []);
                this.loading.set(false);
            },
            error: () => {
                this.errorMessage.set('Unable to load compare products.');
                this.loading.set(false);
            }
        });
    }
}
