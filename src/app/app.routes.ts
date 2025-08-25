import { Routes } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssistanceComponent } from '@app/features/assistance/components/assistance/assistance.component';
import { AuthComponent } from '@app/features/auth/components/auth/auth.component';
import { ForgotPasswordComponent } from '@app/features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app/features/auth/components/reset-password/reset-password.component';
import { AuthGuard } from '@app/features/auth/guards/auth.guard';
import { roleGuard } from '@app/features/auth/guards/role.guard';
import { DashboardComponent } from '@app/features/dashboard/components/dashboard/dashboard.component';
import { NotFoundComponent } from '@app/features/notification/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'assistance',
    component: AssistanceComponent
  },
  {
    path: 'super-admin',
    component: AppComponent,
    canActivate: [AuthGuard, () => roleGuard(['SUPER_ADMIN'])],
    children: []
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
