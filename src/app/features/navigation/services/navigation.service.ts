import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_TO_ASSISTANCE, PATH_TO_LOGIN, PATH_TO_PATIENTS, PATH_TO_TICKETS } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

/**
 * TODO: Documentation for NavigationService (class)
 */
/**
 * TODO: Documentation for NavigationService (class)
 */
/**
 * TODO: Documentation for NavigationService (class)
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

/**
 * TODO: Documentation for constructor (method)
 * @param router - TODO
 * @param authToken - TODO
 * @returns TODO
 */
  constructor(
/**
 * TODO: Documentation for router (property)
 */
    private router: Router,
/**
 * TODO: Documentation for authToken (property)
 */
    private authToken: AuthTokenService
  ) { }

/**
 * TODO: Documentation for navigateToPatients (method)
 * @returns TODO
 */
  navigateToPatients() {
    this.router.navigate([PATH_TO_PATIENTS]);
  }

/**
 * TODO: Documentation for navigateToAssistance (method)
 * @returns TODO
 */
  navigateToAssistance() {
    this.router.navigate([PATH_TO_ASSISTANCE]);
  }

/**
 * TODO: Documentation for navigateToTickets (method)
 * @returns TODO
 */
  navigateToTickets() {
    this.router.navigate([PATH_TO_TICKETS]);
  }

/**
 * TODO: Documentation for navigateToLogin (method)
 * @returns TODO
 */
  navigateToLogin() {
    this.router.navigate([PATH_TO_LOGIN]);
  }

  /**
   * Redirect to the route returned by AuthTokenService.getDefaultRoute().
   * That method encapsulates all role‑based logic including operator role.
   */
/**
 * TODO: Documentation for navigateToHome (method)
 * @returns TODO
 */
  navigateToHome() {
    // jump to default route computed from roles; use navigate so that guards run too
    const target = this.authToken.getDefaultRoute();
    this.router.navigate([target]);
  }
}
