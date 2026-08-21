import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService, ShippingDetails } from '../../services/order.service';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  readonly cart = inject(CartService);
  private orders = inject(OrderService);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()\-]{7,20}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    notes: [''],
  });
  constructor() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.cart.loadCart().subscribe({
      next: () => this.loading.set(false),
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to load cart.');
        this.loading.set(false);
      },
    });
  }
  submit() {
    if (this.form.invalid || !this.cart.items().length) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    this.orders.createOrder(this.form.getRawValue() as ShippingDetails).subscribe({
      next: (o) => this.router.navigate(['/my-orders'], { queryParams: { placed: o._id } }),
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to place order.');
        this.submitting.set(false);
      },
    });
  }
}
