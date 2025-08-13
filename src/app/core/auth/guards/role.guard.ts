import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentRole = authService.getCurrentRole();

  if (currentRole && allowedRoles.includes(currentRole)) {
    return true;
  }

  // Redirect to appropriate dashboard or ***REMOVED***
  router.navigate(['/***REMOVED***']);
  return false;
};
