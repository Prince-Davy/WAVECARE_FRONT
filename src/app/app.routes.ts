
import { Routes } from '@angular/router';


import { authGuard } from './core/auth/guards/auth.guard';
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
    canActivate: [authGuard]
  
  },
  
  // Protected routes
  {
    path: 'super-admin',
    component: AppComponent,
    canActivate: [authGuard, () => roleGuard(['SUPER_ADMIN'])],
    children: [
     
    ]
  },
  
  
  {
    path: '**',
    component: DashboardComponent
  }
];
