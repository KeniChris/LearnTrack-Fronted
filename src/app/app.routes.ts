import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
  },

  {
    path: 'docentes',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'colecciones', pathMatch: 'full' },

      {
        path: 'colecciones',
        loadComponent: () =>
          import('./features/collections/collections-list/collections-list').then(m => m.CollectionsList),
      },
      {
        path: 'colecciones/:collectionName',
        loadComponent: () =>
          import('./features/collections/collection-detail/collection-detail').then(m => m.CollectionDetail),
      },
      {
        path: 'colecciones/:collectionName/estadisticas',
        loadComponent: () =>
          import('./features/collections/collection-stats/collection-stats').then(m => m.CollectionStats),
      },
      {
        path: 'colecciones/:collectionName/temas/:topicId',
        loadComponent: () =>
          import('./features/activities/topic-detail/topic-detail').then(m => m.TopicDetail),
      },
      {
        path: 'colecciones/:collectionName/temas/:topicId/actividades/nueva',
        loadComponent: () =>
          import('./features/activities/select-activity/select-activity').then(m => m.SelectActivity),
      },
      {
        path: 'colecciones/:collectionName/temas/:topicId/actividades/manual',
        loadComponent: () =>
          import('./features/activities/manual-activity/manual-activity').then(m => m.ManualActivity),
      },
      {
        path: 'colecciones/:collectionName/temas/:topicId/actividades/ia',
        loadComponent: () =>
          import('./features/activities/ai-activity/ai-activity').then(m => m.AiActivity),
      },

      {
        path: 'estudiantes',
        loadComponent: () =>
          import('./features/students/students-list/students-list').then(m => m.StudentsList),
      },
      {
        path: 'estudiantes/:groupCode',
        loadComponent: () =>
          import('./features/students/group-detail/group-detail').then(m => m.GroupDetail),
      },
      {
        path: 'estudiantes/:groupCode/estadisticas',
        loadComponent: () =>
          import('./features/students/group-stats/group-stats').then(m => m.GroupStats),
      },
      {
        path: 'estudiantes/:groupCode/ruta',
        loadComponent: () =>
          import('./features/students/learning-path/learning-path').then(m => m.LearningPath),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
