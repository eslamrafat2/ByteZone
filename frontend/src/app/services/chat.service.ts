import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { API_URL } from '../core/api.config';

export interface ChatResponse {
  status: string;
  reply: string;
  filters: { category: string | null; brand: string | null; maxPrice: number | null; memory: number | null; intent: string | null; };
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/chat`;
  sendMessage(message: string): Observable<ChatResponse> { return this.http.post<ChatResponse>(this.apiUrl, { message }); }
}
