import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Nueva ruta para verificar el código (pública)
  {
    path: 'verify-code',
    loadComponent: () => import('./features/auth/verify-code/verify-code.component').then(m => m.VerifyCodeComponent)
  },

  {
    path: 'docentes',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
      },

      // Módulo de Colecciones y Temas (carga perezosa)
      {
        path: 'colecciones',
        loadChildren: () => import('./features/course/course.routes').then(m => m.COURSE_ROUTES)
      },

      // Módulo de Estudiantes (Gestión y Listado)
      {
        path: 'estudiantes',
        loadChildren: () => import('./features/students/students.routes').then(m => m.STUDENTS_ROUTES)
      },

      // Módulo del Hub de Aprendizaje (Análisis de Brechas)
      {
        path: 'hub-ruta',
        loadChildren: () => import('./features/learning-hub/learning-hub.routes').then(m => m.LEARNING_HUB_ROUTES)
      },

      // Actividades (creación manual o con IA) – se carga dentro del contexto de colección/tema
      {
        path: 'colecciones/:collectionId/temas/:topicId/crear',
        loadChildren: () => import('./features/activities/activities.routes').then(m => m.ACTIVITIES_ROUTES)
      }
    ]
  },

  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];