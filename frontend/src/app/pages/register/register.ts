import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';
import { confirmPasswordValidator } from '../../validators/auth.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  submitError = '';
  successMessage = '';

  readonly registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, confirmPasswordValidator('password')]]
  }, {
    validators: [
      (group) => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
      }
    ]
  });

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.submitError = 'Please fix the highlighted errors and try again.';
      return;
    }

    const name = this.registerForm.get('name')?.value?.trim();
    const email = this.registerForm.get('email')?.value?.trim();
    const password = this.registerForm.get('password')?.value;

    if (!name || !email || !password) {
      this.submitError = 'Please fix the highlighted errors and try again.';
      return;
    }

    this.loading = true;
    this.submitError = '';
    this.successMessage = '';

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful. Redirecting to login...';
        this.loading = false;

        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 900);
      },
      error: (error) => {
        this.loading = false;
        this.submitError = error?.error?.message || 'Unable to create account right now.';
      }
    });
  }
}
