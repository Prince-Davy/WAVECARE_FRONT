import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: AuthTokenService, private navigationService: NavigationService, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.tokenService.isTokenValid()) {
        return true;
      } else {
        this.navigationService.navigateToLogin();
        return false;
      }
    } else {
      return false
    }
  }
}
