/**
 * Authentication Login Component Module
 * 
 * Provides the main ***REMOVED*** form for user authentication.
 * Handles form validation, error messages, and authentication flow.
 * 
 * @module AuthComponent
 * @see {@link AuthComponent} for the component class
 */
// auth.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { PATH_TO_ASSISTANCE, PATH_TO_FORGOT_PASSWORD } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for AuthComponent (class)
 */
/**
 * TODO: Documentation for AuthComponent (class)
 */
/**
 * TODO: Documentation for AuthComponent (class)
=======
 * Authentication Login Component
 * 
 * Displays the ***REMOVED*** form and handles user authentication.
 * On successful ***REMOVED***, stores tokens and navigates to the user's default page.
 * Provides links to password reset and assistance.
 * 
 * @class AuthComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    TranslateModule
],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',

})
export class AuthComponent {

  readonly PATH_TO_FORGOT_PASSWORD_FOR_HTML = `/${PATH_TO_FORGOT_PASSWORD}`;
  readonly PATH_TO_ASSISTANCE_FOR_HTML = `/${PATH_TO_ASSISTANCE}`;

/**
 * TODO: Documentation for ***REMOVED***Form (property)
 */
  ***REMOVED***Form: FormGroup;
  hidePassword = true;
/**
 * TODO: Documentation for errorMessage (property)
 */
  errorMessage: string | undefined;
  isLockoutModalOpen = false;
  submitted = false;

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param authService - TODO
 * @param authTokenService - TODO
 * @param navigationService - TODO
 * @param translate - TODO
 * @returns TODO
 */
  constructor(
/**
 * TODO: Documentation for fb (property)
 */
    private fb: FormBuilder,
/**
 * TODO: Documentation for authService (property)
 */
    private authService: AuthService,
/**
 * TODO: Documentation for authTokenService (property)
 */
    private authTokenService: AuthTokenService,
/**
 * TODO: Documentation for navigationService (property)
 */
    private navigationService: NavigationService,
/**
 * TODO: Documentation for translate (property)
 */
    private translate: TranslateService
  ) {

    this.***REMOVED***Form = this.fb.group({
/**
 * TODO: Documentation for username (property)
 */
      username: ['', [Validators.required]],
/**
 * TODO: Documentation for password (property)
 */
      password: ['', [Validators.required]]
    });

    if (this.authTokenService.isAuthenticated()) {
      this.navigationService.navigateToHome();
    }
  }

  get username() {
    return this.***REMOVED***Form.get('username');
  }

  get password() {
    return this.***REMOVED***Form.get('password');
  }

/**
 * TODO: Documentation for onSubmit (method)
 * @returns TODO
 */
  onSubmit() {
    this.submitted = true;
    if (this.***REMOVED***Form.valid) {
      this.authService.***REMOVED***(this.***REMOVED***Form.value)
        .pipe(
          tap((response) => {
            console.log("You are logged in");
            this.navigationService.navigateToHome();
          })
        )
        .subscribe();
    }
  }

/**
 * TODO: Documentation for closeLockoutModal (method)
 * @returns TODO
 */
  closeLockoutModal() {
    this.isLockoutModalOpen = false;
  }
}
