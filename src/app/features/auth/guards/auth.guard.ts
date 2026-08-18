/**
 * Authentication Guard Module
 * 
 * This module provides route guards to protect routes from unauthorized access.
 * It checks if a user is authenticated and refreshes the token if needed.
 * 
 * @module AuthGuard
 * @see {@link authGuard} for the guard implementation
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for authGuard (const)
=======
 * Authentication Guard Function
 * 
 * Protects routes by verifying if a user is authenticated.
 * Attempts to refresh the authentication token if needed.
 * Redirects to ***REMOVED*** page if user is not authenticated.
 * 
 * @function authGuard
 * @type {CanActivateFn}
 * @returns {Promise<boolean | UrlTree>} - True if authenticated, UrlTree to redirect to ***REMOVED*** if not
 * @example
 * // In route configuration:
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
>>>>>>> Stashed changes
 */
export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthTokenService);
  const router = inject(Router);
  const ok = await auth.tryAutoRefresh();
  if (ok && auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree([PATH_TO_LOGIN]);
};
