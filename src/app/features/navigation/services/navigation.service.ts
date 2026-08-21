import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_TO_ASSISTANCE, PATH_TO_LOGIN, PATH_TO_PATIENTS, PATH_TO_TICKETS } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
    private authToken: AuthTokenService
  ) { }

  navigateToPatients() {
    this.router.navigate([PATH_TO_PATIENTS]);
  }

  navigateToAssistance() {
    this.router.navigate([PATH_TO_ASSISTANCE]);
  }

  navigateToTickets() {
    this.router.navigate([PATH_TO_TICKETS]);
  }

  navigateToLogin() {
    this.router.navigate([PATH_TO_LOGIN]);
  }

  /**
   * Redirect to the route returned by AuthTokenService.getDefaultRoute().
   * That method encapsulates all role‑based logic including operator role.
   */
  navigateToHome() {
    // jump to default route computed from roles; use navigate so that guards run too
    const target = this.authToken.getDefaultRoute();
    this.router.navigate([target]);
  }
}
