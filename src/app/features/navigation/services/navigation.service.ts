/**
 * Navigation Service Module
 * 
 * Provides centralized navigation functionality for the Wavecare application.
 * Handles programmatic navigation between different sections of the application
 * based on user roles and authentication status.
 * 
 * @module NavigationService
 * @see {@link NavigationService} for the service class
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_TO_ASSISTANCE, PATH_TO_LOGIN, PATH_TO_PATIENTS, PATH_TO_TICKETS } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for NavigationService (class)
 */
/**
 * TODO: Documentation for NavigationService (class)
 */
/**
 * TODO: Documentation for NavigationService (class)
=======
 * Navigation Service
 * 
 * Centralizes routing and navigation logic for the application.
 * Provides methods to navigate to different sections based on user roles.
 * 
 * @class NavigationService
 * @injectable
 * @see {@link AuthTokenService} for role information
>>>>>>> Stashed changes
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

<<<<<<< Updated upstream
/**
 * TODO: Documentation for constructor (method)
 * @param router - TODO
 * @param authToken - TODO
 * @returns TODO
 */
=======
  /**
   * Constructor
   * 
   * Initializes the navigation service with Angular Router and AuthTokenService.
   * 
   * @constructor
   * @param {Router} router - Angular Router service
   * @param {AuthTokenService} authToken - Authentication token service
   */
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
/**
 * TODO: Documentation for navigateToPatients (method)
 * @returns TODO
 */
=======
  /**
   * Navigate to the patients section
   * 
   * Routes the user to the patients list page.
   * Requires radiologist or radio operator role.
   * 
   * @method navigateToPatients
   * @returns {void}
   * @example
   * this.navigationService.navigateToPatients();
   */
>>>>>>> Stashed changes
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
