import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'bytezone-compare-products';

@Injectable({
    providedIn: 'root'
})
export class CompareService {
    readonly selectedIds = signal<string[]>(this.readStoredIds());
    readonly compareCount = computed(() => this.selectedIds().length);
    readonly isAtCapacity = computed(() => this.selectedIds().length >= 4);
    readonly lastMessage = signal<string>('');

    isProductInCompare(productId: string): boolean {
        const normalizedId = productId?.trim();

        if (!normalizedId) {
            return false;
        }

        return this.selectedIds().includes(normalizedId);
    }

    addProduct(productId: string): { success: boolean; added: boolean; message: string } {
        const normalizedId = productId?.trim();

        if (!normalizedId) {
            this.lastMessage.set('Product not available.');
            return { success: false, added: false, message: 'Product not available.' };
        }

        const currentIds = this.selectedIds();

        if (currentIds.includes(normalizedId)) {
            this.lastMessage.set('This product is already in your compare list.');
            return { success: true, added: true, message: 'This product is already in your compare list.' };
        }

        if (currentIds.length >= 4) {
            this.lastMessage.set('You can compare up to 4 products.');
            return { success: false, added: false, message: 'You can compare up to 4 products.' };
        }

        const nextIds = [...currentIds, normalizedId];
        this.persist(nextIds);
        this.lastMessage.set('Added to compare.');

        return { success: true, added: true, message: 'Added to compare.' };
    }

    removeProduct(productId: string): void {
        const normalizedId = productId?.trim();

        if (!normalizedId) {
            return;
        }

        const nextIds = this.selectedIds().filter((id) => id !== normalizedId);
        this.persist(nextIds);
        this.lastMessage.set('Product removed from compare.');
    }

    clear(): void {
        this.persist([]);
        this.lastMessage.set('Compare list cleared.');
    }

    isSelected(productId: string): boolean {
        return this.selectedIds().includes(productId);
    }

    private persist(ids: string[]): void {
        this.selectedIds.set(ids);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        }
    }

    private readStoredIds(): string[] {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            const storedValue = window.localStorage.getItem(STORAGE_KEY);
            const parsedValue = storedValue ? JSON.parse(storedValue) : [];

            return Array.isArray(parsedValue) ? parsedValue.filter((value) => typeof value === 'string') : [];
        } catch {
            return [];
        }
    }
}
