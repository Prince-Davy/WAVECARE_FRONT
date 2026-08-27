import { Routes } from '@angular/router';
import { administratorGuard, radiologistGuard, radioOperatorGuard } from './features/auth/guards/role.guard';
import { homeRedirectGuard } from './guards/home-redirect.guard';
import {
  PATH_TO_ASSISTANCE,
  PATH_TO_FORGOT_PASSWORD,
  PATH_TO_LOGIN,
  PATH_TO_PATIENTS,
  PATH_TO_RESET_PASSWORD,
  PATH_TO_TICKETS,
  PATH_TO_USERS,
} from './route-paths';

/**
 * Route path constants used across the application to avoid hardcoded strings.
 */
export {
  PATH_TO_ASSISTANCE,
  PATH_TO_FORGOT_PASSWORD,
  PATH_TO_LOGIN,
  PATH_TO_PATIENTS,
  PATH_TO_RESET_PASSWORD,
  PATH_TO_TICKETS,
  PATH_TO_USERS,
} from './route-paths';

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
    canActivate: [administratorGuard],
    loadComponent: () => import('@app/features/dashboard/components/ticket-table/ticket-table.component').then(c => c.TicketTableComponent)
  },
  {
    path: PATH_TO_USERS,
    canActivate: [administratorGuard],
    loadComponent: () => import('@app/features/dashboard/components/users/users.component').then(c => c.UsersComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@app/features/dashboard/components/user-table/user-table.component').then(c => c.UserTableComponent)
      },
      {
        path: 'trash',
        loadComponent: () => import('@app/features/dashboard/components/user-trash/user-trash.component').then(c => c.UserTrashComponent)
      }
    ]
  },
  {
    path: PATH_TO_PATIENTS,
    canActivate: [radiologistGuard],
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
    data: { slug: '/' },
    loadComponent: () => import('@app/features/showcase/pages/showcase/showcase-page.component').then(c => c.ShowcasePageComponent)
  },
  // fin des routes principales

  {
    path: '**',
    loadComponent: () => import('@app/features/notification/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
