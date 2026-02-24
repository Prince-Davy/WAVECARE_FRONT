import { Routes } from '@angular/router';
import { AuthGuard } from '@app/features/auth/guards/auth.guard';

export const PATH_TO_LOGIN = 'login';
export const PATH_TO_FORGOT_PASSWORD = 'forgot-password';
export const PATH_TO_RESET_PASSWORD = 'reset-password';
export const PATH_TO_ASSISTANCE = 'assistance';
export const PATH_TO_TICKETS: string = 'tickets';
export const PATH_TO_USERS: string = 'users';
export const PATH_TO_PATIENTS: string = 'patients';

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
    canActivate: [AuthGuard],
    loadComponent: () => import('@app/features/dashboard/components/ticket-table/ticket-table.component').then(c => c.TicketTableComponent)
  },
  {
    path: PATH_TO_USERS,
    canActivate: [AuthGuard],
    loadComponent: () => import('@app/features/dashboard/components/user-table/user-table.component').then(c => c.UserTableComponent)
  },
  {
    path: PATH_TO_PATIENTS,
    canActivate: [AuthGuard],
    loadComponent: () => import('@app/features/dashboard/components/patient-table/patient-table.component').then(c => c.PatientTableComponent)
  },
  
  {
    path: '',
    redirectTo: PATH_TO_TICKETS,
    pathMatch: "full"
  },
  {
    path: '**',
    loadComponent: () => import('@app/features/notification/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
