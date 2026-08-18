/**
 * Not Found (404) Page Component Module
 * 
 * Displays a user-friendly 404 page when navigating to non-existent routes.
 * Provides navigation options to return to main sections.
 * 
 * @module NotFoundComponent
 * @see {@link NotFoundComponent} for the component class
 */
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PATH_TO_ASSISTANCE } from '@app/app.routes';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

/**
<<<<<<< Updated upstream
 * NotFoundComponent
 * Simple 404 view that offers assistance navigation to users.
 */
/**
 * TODO: Documentation for NotFoundComponent (class)
 */
/**
 * TODO: Documentation for NotFoundComponent (class)
=======
 * Not Found (404) Error Page Component
 * 
 * Displays when user navigates to a non-existent route.
 * Provides:
 * - Friendly error message
 * - Links to assistance and main sections
 * - Navigation options based on user role
 * 
 * @class NotFoundComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatButton,
    MatIconModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  /**
   * Path to assistance page for HTML template binding
   */
  readonly PATH_TO_ASSISTANCE_FOR_HTML = `/${PATH_TO_ASSISTANCE}`;

<<<<<<< Updated upstream
/**
 * TODO: Documentation for constructor (method)
 * @param navigationService - TODO
 * @returns TODO
 */
=======
  /**
   * Navigation service for role-based navigation
   */
>>>>>>> Stashed changes
  constructor(public navigationService: NavigationService) { }
}
