/**
 * Navigation Bar (Navbar) Component Module
 * 
 * Provides the application's main navigation bar with links to key sections
 * and user account management options.
 * 
 * @module NavbarComponent
 * @see {@link NavbarComponent} for the component class
 */
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { PATH_TO_PATIENTS, PATH_TO_TICKETS, PATH_TO_USERS } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';

/**
<<<<<<< Updated upstream
 * NavbarComponent
 * Top navigation bar showing links and user/session actions.
 */
/**
 * TODO: Documentation for NavbarComponent (class)
 */
/**
 * TODO: Documentation for NavbarComponent (class)
=======
 * Navigation Bar Component
 * 
 * Main navigation bar displayed at the top of the application.
 * Shows:
 * - Links to main sections (tickets, users, patients) based on user role
 * - User account menu with logout option
 * - i18n language selector
 * 
 * @class NavbarComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    TranslateModule,
    MatIconModule,
    CommonModule
],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  /**
   * Navigation path to tickets section for template binding
   */
  readonly PATH_TO_TICKETS_FOR_HTML = `/${PATH_TO_TICKETS}`;

  /**
   * Navigation path to users section for template binding
   */
  readonly PATH_TO_USERS_FOR_HTML = `/${PATH_TO_USERS}`;

  /**
   * Navigation path to patients section for template binding
   */
  readonly PATH_TO_PATIENTS_FOR_HTML = `/${PATH_TO_PATIENTS}`;

<<<<<<< Updated upstream
/**
 * TODO: Documentation for constructor (method)
 * @param authService - TODO
 * @param authTokenService - TODO
 * @param navigationService - TODO
 * @param router - TODO
 * @returns TODO
 */
  constructor(private readonly authService: AuthService, public authTokenService: AuthTokenService, private readonly navigationService: NavigationService, public router: Router) { }

/**
 * TODO: Documentation for logout (method)
 * @returns TODO
 */
=======
  /**
   * Initialize navbar component with navigation and auth services
   * 
   * @constructor
   * @param {AuthService} authService - Authentication service for logout
   * @param {AuthTokenService} authTokenService - Service for accessing token and role info
   * @param {NavigationService} navigationService - Navigation service for role-based routing
   * @param {Router} router - Angular Router for navigation
   */
  constructor(
    private readonly authService: AuthService,
    public authTokenService: AuthTokenService,
    private readonly navigationService: NavigationService,
    public router: Router
  ) { }

  /**
   * Handle user logout
   * Clears authentication tokens and redirects to ***REMOVED*** page
   */
>>>>>>> Stashed changes
  logout(): void {
    this.authService.logout();
    this.navigationService.navigateToLogin();
  }
}
