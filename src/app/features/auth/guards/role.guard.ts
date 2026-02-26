import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

function createRoleGuard(check: (auth: AuthTokenService) => boolean): CanActivateFn {
  return async () => {
    const auth = inject(AuthTokenService);
    const nav = inject(NavigationService);
    const ok = await auth.tryAutoRefresh();
    if (!ok) {
      nav.navigateToLogin();
      return false;
    }
    if (check(auth)) {
      return true;
    }
    nav.navigateToLogin();
    return false;
  };
}

export const radiologistGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadiologist()
);

export const administratorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isAdministrator()
);

export const radioOperatorGuard: CanActivateFn = createRoleGuard((auth) =>
  auth.isRadioOperator()
);
