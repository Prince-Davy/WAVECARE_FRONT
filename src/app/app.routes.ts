
import { Routes } from '@angular/router';


import { AuthGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/pages/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './features/auth/pages/forgot-password/forgot-password.component';
import {AssistanceComponent} from './features/auth/pages/assitance/assistance.component';

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
    component: DashboardComponent ,
    canActivate: [AuthGuard]

  },
  {
    path: 'assistance',
    component: AssistanceComponent ,
    canActivate: [AuthGuard]
  },
  // Protected routes
  {
    path: 'super-admin',
    component: AppComponent,
    canActivate: [AuthGuard, () => roleGuard(['SUPER_ADMIN'])],
    children: [

    ]
  },
  {
    path: '**',
    component: DashboardComponent
  }
];
