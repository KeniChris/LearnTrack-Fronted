import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. RUTAS PÚBLICAS
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },

  // 2. RUTAS PROTEGIDAS (DOCENTES)
  {
    path: 'docentes',
    component: MainLayoutComponent, // <-- Contiene el Sidebar
    canActivate: [authGuard],       // Protegido por el Guard
    children: [                    
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      // Dashboard Inicial del Docente
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
      },

      // Módulo de Colecciones y Temas
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
      }
    ]
  },

  // 3. RUTAS DE ADMINISTRACIÓN
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },

  // Fallback para rutas no encontradas
  { path: '**', redirectTo: 'login' }
];