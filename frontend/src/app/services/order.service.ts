import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  product?: { _id: string; name: string; image?: string } | string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingDetails { fullName:string; phone:string; address:string; city:string; notes?:string; }

export interface Order {
  _id: string;
  user?: { _id?: string; name?: string; email?: string } | string;
  customer: ShippingDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/orders';

  createOrder(customer: ShippingDetails): Observable<Order> {
    return this.http.post<{ status: string; order: Order }>(this.apiUrl, customer).pipe(map(r => r.order));
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<{ status: string; count: number; orders: Order[] }>(this.apiUrl).pipe(map(r => r.orders));
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<{ status: string; order: Order }>(`${this.apiUrl}/${id}`).pipe(map(r => r.order));
  }
}
