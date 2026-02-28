import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'topics',
    loadChildren: () => import('./features/qa/qa.routes').then(m => m.qaRoutes)
  },
  {
    path: 'wiki',
    loadChildren: () => import('./features/wiki/wiki.routes').then(m => m.wikiRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  }
];
