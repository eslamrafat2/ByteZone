import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { API_URL } from '../core/api.config';

export interface CartItem { product: Product; quantity: number; }
export interface Cart { _id?: string; user?: string; items: CartItem[]; }
interface CartResponse { status: string; cart: Cart; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/cart`;
  readonly cart = signal<Cart>({ items: [] });
  readonly items = computed(() => this.cart().items);
  readonly itemCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  readonly hasStockIssue = computed(() => this.items().some(item => item.product.stock === 0 || item.quantity > item.product.stock));
  isInCart(productId: string): boolean { return this.items().some(item => item.product._id === productId); }
  loadCart(): Observable<Cart> { return this.http.get<CartResponse>(this.apiUrl).pipe(map(response => response.cart), tap(cart => this.cart.set(cart))); }
  addProduct(product: Product, quantity = 1): Observable<Cart> { return this.http.post<CartResponse>(this.apiUrl, { productId: product._id, quantity }).pipe(map(response => response.cart), tap(cart => this.cart.set(cart))); }
  updateQuantity(productId: string, quantity: number): Observable<Cart> { return this.http.put<CartResponse>(`${this.apiUrl}/${productId}`, { quantity }).pipe(map(response => response.cart), tap(cart => this.cart.set(cart))); }
  removeProduct(productId: string): Observable<Cart> { return this.http.delete<CartResponse>(`${this.apiUrl}/${productId}`).pipe(map(response => response.cart), tap(cart => this.cart.set(cart))); }
  clear(): Observable<void> { return this.http.delete<{ status: string; message: string }>(this.apiUrl).pipe(map(() => undefined), tap(() => this.cart.set({ items: [] }))); }
}
