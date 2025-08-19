import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();

      if (token) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/***REMOVED***']);
      }
    } else {
      this.router.navigate(['/***REMOVED***']);
    }

    return false;
  }
}
