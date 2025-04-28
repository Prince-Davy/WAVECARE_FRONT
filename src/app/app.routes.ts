import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/pages/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './features/auth/pages/***REMOVED***/***REMOVED***.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

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
    path: 'super-admin',
    component: AppComponent,
    canActivate: [AuthGuard, () => roleGuard(['SUPER_ADMIN'])],
    children: []
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