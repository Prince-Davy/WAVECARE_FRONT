import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

/**
 * TODO: Documentation for createRoleGuard (function)
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
 * TODO: Documentation for radiologistGuard (const)
 */
export const radiologistGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadiologist()
);

/**
 * TODO: Documentation for administratorGuard (const)
 */
export const administratorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isAdministrator()
);

/**
 * TODO: Documentation for radioOperatorGuard (const)
 */
export const radioOperatorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadioOperator()
);
