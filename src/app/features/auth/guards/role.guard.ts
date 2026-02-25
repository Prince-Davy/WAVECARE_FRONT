import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';



export const radiologistGuard: CanActivateFn = () => {
  const auth = inject(AuthTokenService);
  if (auth.isRadiologist()) return true;
  inject(NavigationService).navigateToLogin();
  return false;
};


export const administratorGuard: CanActivateFn = () => {
  const auth = inject(AuthTokenService);
  const nav = inject(NavigationService);
  if (auth.isAdministrator()) return true;
  nav.navigateToLogin();
  return false;
};

export const radio_operatorGuard: CanActivateFn = () => {
  const auth = inject(AuthTokenService);
  const nav = inject(NavigationService);
  if (auth.isRadioOperator()) return true;
  nav.navigateToLogin();
  return false;
};