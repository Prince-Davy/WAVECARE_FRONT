/**
 * Role-Based Access Guard Module
 * 
 * Provides route guards that check user roles and permissions.
 * Includes guards for radiologist, administrator, and radio operator roles.
 * Automatically refreshes authentication tokens before checking roles.
 * 
 * @module RoleGuard
 * @see {@link radiologistGuard} for radiologist role guard
 * @see {@link administratorGuard} for administrator role guard
 * @see {@link radioOperatorGuard} for radio operator role guard
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for createRoleGuard (function)
=======
 * Creates a role-based access guard with custom role checking logic
 * 
 * This factory function creates a CanActivateFn that:
 * 1. Attempts to auto-refresh the authentication token
 * 2. Verifies the user has the required role
 * 3. Returns true if authenticated and authorized
 * 4. Redirects to ***REMOVED*** page if not authenticated or unauthorized
 * 
 * @function createRoleGuard
 * @param {Function} check - Function to check if user has required role
 * @returns {CanActivateFn} Guard function that can be used in route configuration
 * @private
>>>>>>> Stashed changes
 */
function createRoleGuard(check: (auth: AuthTokenService) => boolean): CanActivateFn {
  return async (): Promise<boolean | UrlTree> => {
    const auth = inject(AuthTokenService);
    const router = inject(Router);
    const ok = await auth.tryAutoRefresh();
    if (!ok) {
      return router.createUrlTree([PATH_TO_LOGIN]);
    }
    if (check(auth)) {
      return true;
    }
    return router.createUrlTree([PATH_TO_LOGIN]);
  };
}

/**
<<<<<<< Updated upstream
 * TODO: Documentation for radiologistGuard (const)
=======
 * Radiologist Role Guard
 * 
 * Protects routes to ensure only users with radiologist role can access them.
 * Automatically refreshes token before checking role.
 * 
 * @constant
 * @type {CanActivateFn}
 * @example
 * {
 *   path: 'radiologist-dashboard',
 *   component: RadiologistComponent,
 *   canActivate: [radiologistGuard]
 * }
>>>>>>> Stashed changes
 */
export const radiologistGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadiologist()
);

/**
<<<<<<< Updated upstream
 * TODO: Documentation for administratorGuard (const)
=======
 * Administrator Role Guard
 * 
 * Protects routes to ensure only users with administrator role can access them.
 * Automatically refreshes token before checking role.
 * 
 * @constant
 * @type {CanActivateFn}
 * @example
 * {
 *   path: 'admin-panel',
 *   component: AdminPanelComponent,
 *   canActivate: [administratorGuard]
 * }
>>>>>>> Stashed changes
 */
export const administratorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isAdministrator()
);

/**
<<<<<<< Updated upstream
 * TODO: Documentation for radioOperatorGuard (const)
=======
 * Radio Operator Role Guard
 * 
 * Protects routes to ensure only users with radio operator role can access them.
 * Automatically refreshes token before checking role.
 * 
 * @constant
 * @type {CanActivateFn}
 * @example
 * {
 *   path: 'operator-console',
 *   component: OperatorConsoleComponent,
 *   canActivate: [radioOperatorGuard]
 * }
>>>>>>> Stashed changes
 */
export const radioOperatorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadioOperator()
);
