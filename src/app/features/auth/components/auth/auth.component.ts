// auth.component.ts

import { Component, OnInit } from '@angular/core';
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
export class AuthComponent implements OnInit {

  readonly PATH_TO_FORGOT_PASSWORD_FOR_HTML = `/${PATH_TO_FORGOT_PASSWORD}`;
  readonly PATH_TO_ASSISTANCE_FOR_HTML = `/${PATH_TO_ASSISTANCE}`;

  ***REMOVED***Form: FormGroup;
  hidePassword = true;
  errorMessage: string | undefined;
  isLockoutModalOpen = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authTokenService: AuthTokenService,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {

    this.***REMOVED***Form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
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

  onSubmit() {
    this.submitted = true;
    if (this.***REMOVED***Form.valid) {
      this.authService.***REMOVED***(this.***REMOVED***Form.value).subscribe({
        next: (response) => {
          console.log("You are logged in");
          this.navigationService.navigateToHome();
        },
        error: (error) => {
          if (error.status === 429) {
            // Scenario 2: Lockout
            this.isLockoutModalOpen = true;
          } else if (error.status === 401) {
            this.errorMessage = this.translate.instant('feature.auth.auth-component.form.submit.error-message.auth-error');
          } else {
            this.errorMessage = this.translate.instant('feature.auth.auth-component.form.submit.error-message.server-error');
          }
        }
      });
    }
  }

  closeLockoutModal() {
    this.isLockoutModalOpen = false;
  }
}
