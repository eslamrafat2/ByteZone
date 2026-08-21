import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboard, AdminService } from '../../../services/admin.service';
import { Order } from '../../../services/order.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-overview.html',
  styleUrl: '../admin-shared.css',
})
export class AdminOverview {
  private readonly service = inject(AdminService);
  readonly dashboard = signal<AdminDashboard | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  constructor() {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.service.getDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.orders.set(data.recentOrders || []);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message || 'Unable to load dashboard.');
        this.loading.set(false);
      },
    });
  }

  getCustomerName(order: Order): string {
    if (order.user && typeof order.user === 'object') {
      return order.user.name || 'Customer';
    }

    return 'Customer';
  }
}
