import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./components/user-list.component').then(m => m.UserListComponent),
    canActivate: [authGuard, roleGuard('Admin', 'UserManager')]
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/category-list.component').then(m => m.CategoryListComponent),
    canActivate: [authGuard, roleGuard('Admin')]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard, roleGuard('Admin')]
  }
];
