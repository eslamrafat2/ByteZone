import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details').then((m) => m.ProductDetails),
  },

  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage),
    canActivate: [authGuard],
  },

  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutPage),
    canActivate: [authGuard],
  },

  {
    path: 'my-orders',
    loadComponent: () => import('./pages/my-orders/my-orders').then((m) => m.MyOrders),
    canActivate: [authGuard],
  },


  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },

  {
    path: 'policy',
    loadComponent: () => import('./pages/policy/policy').then((m) => m.Policy),
  },

  {
    path: 'budget-finder',
    loadComponent: () => import('./pages/budget-finder/budget-finder').then((m) => m.BudgetFinder),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/overview/admin-overview').then((m) => m.AdminOverview),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/products/admin-products').then((m) => m.AdminProducts),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/orders/admin-orders').then((m) => m.AdminOrders),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/admin-users').then((m) => m.AdminUsers),
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/admin/reviews/admin-reviews').then((m) => m.AdminReviews),
      },
    ],
  },

  {
    path: 'compare',
    loadComponent: () => import('./pages/compare/compare').then((m) => m.ComparePage),
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },

  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
