import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

/**
 * Guard placed on the application root (or login page) to send authenticated
 * users to their "home" route and unauthenticated ones to the login screen.
 * Always returns a UrlTree so that navigation is handled by the router.
 */
export const homeRedirectGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthTokenService);
  const router = inject(Router);

  const ok = await auth.tryAutoRefresh();
  if (ok && auth.isAuthenticated()) {
    const target = auth.getDefaultRoute();
    return router.createUrlTree([target]);
  }

  // not logged in, let request proceed (presumably to login route)
  return true;
};
