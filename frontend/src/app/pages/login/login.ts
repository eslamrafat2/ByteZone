import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  submitError = '';

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.submitError = 'Please enter a valid email and password.';
      return;
    }

    const email = this.loginForm.get('email')?.value?.trim();
    const password = this.loginForm.get('password')?.value;

    if (!email || !password) {
      this.submitError = 'Please enter a valid email and password.';
      return;
    }

    this.loading = true;
    this.submitError = '';

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.authService.getCurrentUser().subscribe({
          next: () => {
            this.router.navigateByUrl('/profile');
          },
          error: () => {
            this.router.navigateByUrl('/profile');
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.submitError = error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
