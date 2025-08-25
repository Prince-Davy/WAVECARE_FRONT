import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: AuthTokenService, private navigationService: NavigationService) { }

  canActivate(): boolean {
    if (this.tokenService.isTokenValid()) {
      return true;
    } else {
      this.navigationService.navigateToLogin();
      return false;
    }
  }
}
