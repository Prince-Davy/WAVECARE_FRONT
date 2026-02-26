import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthTokenService);
  const nav = inject(NavigationService);
  const ok = await auth.tryAutoRefresh();
  if (ok && auth.isTokenValid()) {
    return true;
  }
  nav.navigateToLogin();
  return false;
};
