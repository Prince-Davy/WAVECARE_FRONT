
import { Routes } from '@angular/router';


import { AuthGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/pages/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

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
    path: 'dashboard',
    component: DashboardComponent ,
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
