import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const wikiRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/wiki-tree.component').then(m => m.WikiTreeComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/wiki-editor.component').then(m => m.WikiEditorComponent),
    canActivate: [authGuard, roleGuard('WikiEditor', 'Admin')]
  },
  {
    path: ':id',
    loadComponent: () => import('./components/wiki-page.component').then(m => m.WikiPageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/wiki-editor.component').then(m => m.WikiEditorComponent),
    canActivate: [authGuard, roleGuard('WikiEditor', 'Admin')]
  }
];
