import { Routes } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AuthGuard } from '@app/core/auth/guards/auth.guard';
import { roleGuard } from '@app/core/auth/guards/role.guard';
import { AssistanceComponent } from '@app/features/auth/pages/assistance/assistance.component';
import { AuthComponent } from '@app/features/auth/pages/auth/auth.component';
import { ForgotPasswordComponent } from '@app/features/auth/pages/***REMOVED***/***REMOVED***.component';
import { ResetPasswordComponent } from '@app/features/auth/pages/***REMOVED***/***REMOVED***.component';
import { DashboardComponent } from '@app/features/dashboard/dashboard.component';
import { NotFoundComponent } from '@app/features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/***REMOVED***',
    pathMatch: 'full'
  },
  {
    path: '***REMOVED***',
    component: AuthComponent
  },
  {
    path: '***REMOVED***',
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
    path: '***REMOVED***',
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
