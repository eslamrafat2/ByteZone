import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly user = this.authService.user;
  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  readonly profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  loading = true;
  saving = false;
  error = '';
  submitError = '';
  successMessage = '';
  passwordError = '';
  passwordSuccess = '';
  passwordSaving = false;
  editMode = false;
  private originalUser: Partial<User> | null = null;

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    const existingUser = this.authService.user();

    if (existingUser) {
      this.loading = false;
      this.error = '';
      this.originalUser = { ...existingUser };
      this.profileForm.patchValue({
        name: existingUser.name,
        email: existingUser.email,
      });
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.loading = false;
        this.originalUser = { ...user };
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = error?.error?.message || 'Unable to load your profile.';
      },
    });
  }

  startEdit(): void {
    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    this.originalUser = { ...currentUser };
    this.profileForm.patchValue({
      name: currentUser.name,
      email: currentUser.email,
    });
    this.submitError = '';
    this.successMessage = '';
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.submitError = '';
    this.successMessage = '';

    if (this.originalUser) {
      this.profileForm.patchValue({
        name: this.originalUser.name ?? '',
        email: this.originalUser.email ?? '',
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.submitError = 'Please provide a valid name and email.';
      return;
    }

    const payload = {
      name: this.profileForm.get('name')?.value?.trim(),
      email: this.profileForm.get('email')?.value?.trim().toLowerCase(),
    };

    if (!payload.name || !payload.email) {
      this.submitError = 'Please provide a valid name and email.';
      return;
    }

    this.saving = true;
    this.submitError = '';
    this.successMessage = '';

    this.authService
      .updateProfile(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe({
        next: (updatedUser) => {
          this.editMode = false;
          this.originalUser = { ...updatedUser };
          this.successMessage = 'Profile updated successfully.';

          setTimeout(() => {
            this.successMessage = '';
          }, 2500);
        },
        error: (error) => {
          if (error?.status === 401) {
            this.submitError = 'Your session is no longer valid. Please log in again.';
            this.authService.clearSession();
            this.router.navigateByUrl('/login');
            return;
          }

          this.submitError = error?.error?.message || 'Unable to save profile changes.';
        },
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordError =
        'Enter your current password and a new password of at least 6 characters.';
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.passwordError = 'New password and confirmation do not match.';
      return;
    }

    this.passwordSaving = true;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.authService
      .changePassword({ currentPassword: currentPassword!, newPassword: newPassword! })
      .subscribe({
        next: (response) => {
          this.passwordSaving = false;
          this.passwordSuccess = response.message;
          this.passwordForm.reset();
          this.authService.clearSession();
          setTimeout(() => this.router.navigateByUrl('/login'), 1200);
        },
        error: (error) => {
          this.passwordSaving = false;
          this.passwordError = error?.error?.message || 'Unable to change password.';
        },
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login'),
    });
  }

  getSafeUser(): User | null {
    return this.user();
  }
}
