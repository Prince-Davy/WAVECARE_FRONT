import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthTokenService);
  const router = inject(Router);
  const ok = await auth.tryAutoRefresh();
  if (ok && auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree([PATH_TO_LOGIN]);
};
