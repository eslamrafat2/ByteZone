import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../shared/models/product.model';
import { API_URL } from '../core/api.config';

export type ProductAvailability = 'inStock' | 'outOfStock';
export type ProductSort = 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc' | 'newest';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: ProductAvailability;
  sort?: ProductSort;
}

export interface ProductsResponse {
  status: string;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
  brands: string[];
  products: Product[];
}

interface ProductResponse { status: string; product: Product; }
interface CompareProductsResponse { status: string; products: Product[]; }

export interface ProductReviewPayload { rating: number; comment: string; }

export interface ProductReviewsResponse {
  status: string;
  count: number;
  averageRating: number;
  reviews: Array<{
    _id: string;
    user?: { _id?: string; name?: string } | null;
    rating: number;
    comment: string;
    createdAt?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/products`;

  getProducts(query: ProductsQuery = {}): Observable<ProductsResponse> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') params = params.set(key, value);
    }
    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  compareProducts(ids: string[]): Observable<CompareProductsResponse> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<CompareProductsResponse>(`${this.apiUrl}/compare`, { params });
  }

  getProductReviews(productId: string): Observable<ProductReviewsResponse> {
    return this.http.get<ProductReviewsResponse>(`${this.apiUrl}/${productId}/reviews`);
  }

  getReviewEligibility(productId: string): Observable<{ status: string; eligible: boolean; alreadyReviewed: boolean; approved: boolean }> {
    return this.http.get<{ status: string; eligible: boolean; alreadyReviewed: boolean; approved: boolean }>(`${this.apiUrl}/${productId}/review-eligibility`);
  }

  createProductReview(productId: string, payload: ProductReviewPayload): Observable<{ status: string; review: unknown }> {
    return this.http.post<{ status: string; review: unknown }>(`${this.apiUrl}/${productId}/reviews`, payload);
  }

  deleteProductReview(productId: string, reviewId: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/${productId}/reviews/${reviewId}`);
  }
}
