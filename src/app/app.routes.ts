import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { administratorGuard, radiologistGuard, radioOperatorGuard } from './features/auth/guards/role.guard';
import { homeRedirectGuard } from './guards/home-redirect.guard';

/**
 * Route path constants used across the application to avoid hardcoded strings.
 */
export const PATH_TO_LOGIN = 'login';
/**
 * TODO: Documentation for PATH_TO_FORGOT_PASSWORD (const)
 */
export const PATH_TO_FORGOT_PASSWORD = 'forgot-password';
/**
 * TODO: Documentation for PATH_TO_RESET_PASSWORD (const)
 */
export const PATH_TO_RESET_PASSWORD = 'reset-password';
/**
 * TODO: Documentation for PATH_TO_ASSISTANCE (const)
 */
export const PATH_TO_ASSISTANCE = 'assistance';
/**
 * TODO: Documentation for PATH_TO_TICKETS (const)
 */
export const PATH_TO_TICKETS: string = 'tickets';
/**
 * TODO: Documentation for PATH_TO_USERS (const)
 */
export const PATH_TO_USERS: string = 'users';
/**
 * TODO: Documentation for PATH_TO_PATIENTS (const)
 */
export const PATH_TO_PATIENTS: string = 'patients';

/**
 * routes
 * Application route definitions, using lazy-loaded standalone components
 * and guards for authorization.
 */
export const routes: Routes = [
  {
    path: PATH_TO_LOGIN,
    loadComponent: () => import('@app/features/auth/components/auth/auth.component').then(c => c.AuthComponent)
  },
  {
    path: PATH_TO_FORGOT_PASSWORD,
    loadComponent: () => import('@app/features/auth/components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: PATH_TO_RESET_PASSWORD,
    loadComponent: () => import('@app/features/auth/components/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
  },
  {
    path: PATH_TO_ASSISTANCE,
    loadComponent: () => import('@app/features/assistance/components/assistance/assistance.component').then(c => c.AssistanceComponent)
  },
  {
    path: PATH_TO_TICKETS,
    canActivate: [authGuard, administratorGuard],
    loadComponent: () => import('@app/features/dashboard/components/ticket-table/ticket-table.component').then(c => c.TicketTableComponent)
  },
  {
    path: PATH_TO_USERS,
    canActivate: [authGuard, administratorGuard],
    loadComponent: () => import('@app/features/dashboard/components/user-table/user-table.component').then(c => c.UserTableComponent)
  },
  {
    path: PATH_TO_PATIENTS,
    canActivate: [authGuard, radiologistGuard],
    loadComponent: () => import('@app/features/dashboard/components/patients/patients.component').then(c => c.PatientsComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@app/features/dashboard/components/patients/patient-table/patient-table.component').then(c => c.PatientTableComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('@app/features/dashboard/components/patients/patient-detail/patient-detail.component').then(c => c.PatientDetailComponent)
      }
    ]
  },
  {
    path: '',
    canActivate: [homeRedirectGuard],
    loadComponent: () => import('@app/features/auth/components/auth/auth.component').then(c => c.AuthComponent),
    // guard may return UrlTree to a home route or true to show login component
  },
  // fin des routes principales

  {
    path: '**',
    loadComponent: () => import('@app/features/notification/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
