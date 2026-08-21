import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus } from './order.service';
import { Product } from '../shared/models/product.model';

export interface AdminDashboard {
  products: number;
  users: number;
  orders: number;
  revenue: number;
  recentOrders: Order[];
}
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminReview {
  _id: string;
  user: { _id?: string; name?: string; email?: string } | null;
  product: { _id?: string; name?: string; image?: string; price?: number } | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt?: string;
  approvedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/admin';
  private readonly productApi = 'http://localhost:3000/api/products';

  getDashboard(): Observable<AdminDashboard> {
    return this.http
      .get<{ data: AdminDashboard }>(`${this.apiUrl}/dashboard`)
      .pipe(map((r) => r.data));
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<{ users: AdminUser[] }>(`${this.apiUrl}/users`).pipe(map((r) => r.users));
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<{ orders: Order[] }>(`${this.apiUrl}/orders?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      .pipe(map((r) => r.orders));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http
      .put<{ order: Order }>(`${this.apiUrl}/orders/${id}`, { status })
      .pipe(map((r) => r.order));
  }

  getReviews(status: 'all' | 'pending' | 'approved' = 'all'): Observable<AdminReview[]> {
    const q = status === 'all' ? '' : `?status=${status}`;
    return this.http
      .get<{ reviews: AdminReview[] }>(`${this.apiUrl}/reviews${q}`)
      .pipe(map((r) => r.reviews));
  }

  updateReviewApproval(id: string, approved: boolean): Observable<AdminReview> {
    return this.http
      .put<{ review: AdminReview }>(`${this.apiUrl}/reviews/${id}`, { approved })
      .pipe(map((r) => r.review));
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`);
  }

  createProduct(payload: Partial<Product>): Observable<Product> {
    return this.http
      .post<{ product: Product }>(this.productApi, payload)
      .pipe(map((r) => r.product));
  }

  updateProduct(id: string, payload: Partial<Product>): Observable<Product> {
    return this.http
      .put<{ product: Product }>(`${this.productApi}/${id}`, payload)
      .pipe(map((r) => r.product));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.productApi}/${id}`);
  }

  uploadProductImage(file: File): Observable<string> {
    const body = new FormData();
    body.append('image', file);
    return this.http
      .post<{ image: string }>(`${this.productApi}/upload-image`, body)
      .pipe(map((r) => r.image));
  }
}
