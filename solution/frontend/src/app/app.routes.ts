import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
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
