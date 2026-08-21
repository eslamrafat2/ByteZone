import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  return user?.role === 'admin' ? true : router.createUrlTree(['/']);
};
