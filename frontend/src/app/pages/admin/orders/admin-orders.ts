import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Order, OrderStatus } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: '../admin-shared.css',
})
export class AdminOrders {
  private readonly service = inject(AdminService);
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly saving = signal('');
  readonly expanded = signal<string | null>(null);
  readonly statuses: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.service.getOrders().subscribe({
      next: (o) => {
        this.orders.set(o);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to load orders.');
        this.loading.set(false);
      },
    });
  }
  toggle(id: string) {
    this.expanded.update((v) => (v === id ? null : id));
  }
  imageUrl(image?: string) {
    if (!image) return '';
    if (image.startsWith('/uploads/')) return `http://localhost:3000${image}`;
    if (image.startsWith('http')) return image;
    return `/images/products/${image}`;
  }
  update(o: Order, status: string) {
    this.saving.set(o._id);
    this.service.updateOrderStatus(o._id, status as OrderStatus).subscribe({
      next: (u) => {
        this.orders.update((list) => list.map((x) => (x._id === u._id ? u : x)));
        this.saving.set('');
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to update order.');
        this.saving.set('');
      },
    });
  }
}
