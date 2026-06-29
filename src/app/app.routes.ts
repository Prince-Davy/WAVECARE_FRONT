import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { administratorGuard, radiologistGuard, radioOperatorGuard } from './features/auth/guards/role.guard';
import { homeRedirectGuard } from './guards/home-redirect.guard';

/**
 * Route path constants used across the application to avoid hardcoded strings.
 */
export const PATH_TO_LOGIN = 'login';
/**
 * Path constant for the forgot password route.
 */
export const PATH_TO_FORGOT_PASSWORD = 'forgot-password';
/**
 * Path constant for the password reset route.
 */
export const PATH_TO_RESET_PASSWORD = 'reset-password';
/**
 * Path constant for the assistance/help route.
 */
export const PATH_TO_ASSISTANCE = 'assistance';
/**
 * Path constant for the tickets management route.
 */
export const PATH_TO_TICKETS: string = 'tickets';
/**
 * Path constant for the users management route.
 */
export const PATH_TO_USERS: string = 'users';
/**
 * Path constant for the patients management route.
 */
export const PATH_TO_PATIENTS: string = 'patients';
/**
 * Path constant for the trash management route.
 */
export const PATH_TO_USERS_TRASH: string = 'users/trash';

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
    path: PATH_TO_USERS_TRASH,
    canActivate: [authGuard, administratorGuard],
    loadComponent: () => import('@app/features/dashboard/components/user-trash/user-trash.component').then(c => c.UserTrashComponent)
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
