import { Routes } from '@angular/router';

export const qaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/topic-list.component').then(m => m.TopicListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/topic-detail.component').then(m => m.TopicDetailComponent)
  }
];
