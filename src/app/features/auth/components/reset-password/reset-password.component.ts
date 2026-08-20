
import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

/**
 * TODO: Documentation for ResetPasswordComponent (class)
 */
/**
 * TODO: Documentation for ResetPasswordComponent (class)
 */
/**
 * TODO: Documentation for ResetPasswordComponent (class)
 */
@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    RouterLink
],
  templateUrl: './***REMOVED***.component.html',
  styleUrls: ['./***REMOVED***.component.scss']
})

export class ResetPasswordComponent {
/**
 * TODO: Documentation for resetForm (property)
 */
  resetForm: FormGroup;
/**
 * TODO: Documentation for token (property)
 */
  token: string | null = null;
/**
 * TODO: Documentation for userId (property)
 */
  userId: string = '';
/**
 * TODO: Documentation for email (property)
 */
  email: string = '';
/**
 * TODO: Documentation for message (property)
 */
  message: string | undefined;
  isError = false;
  showNewPassword = false;
  showConfirmPassword = false;

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param authService - TODO
 * @param route - TODO
 * @param navigationService - TODO
 * @param translate - TODO
 * @returns TODO
 */
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly navigationService: NavigationService,
    private readonly translate: TranslateService
  ) {
    this.resetForm = this.fb.group({
/**
 * TODO: Documentation for newPassword (property)
 */
      newPassword: ['', [
        Validators.required,
        this.passwordPatternValidator()
      ]],
/**
 * TODO: Documentation for confirmPassword (property)
 */
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator } as AbstractControlOptions);

    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token && this.token.trim() !== '') {
      this.loadUserInfoFromToken();
    } else {
      this.translate.onTranslationChange
        .pipe(takeUntilDestroyed())
        .subscribe(
          () => this.message = this.translate.instant('feature.auth.***REMOVED***-component.message.error.invalid-link')
        );
      this.isError = true;
    }
  }

/**
 * TODO: Documentation for loadUserInfoFromToken (method)
 * @returns TODO
 */
  loadUserInfoFromToken() {
    if (!this.token) return;

    this.authService.readToken(this.token)
      .pipe(
        tap(data => {
          this.userId = data.id;
          this.email = data.email;
          this.isError = false;
        })
      )
      .subscribe();
  }

/**
 * TODO: Documentation for passwordMatchValidator (method)
 * @param form - TODO
 * @returns TODO
 */
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

/**
 * TODO: Documentation for passwordPatternValidator (method)
 * @returns TODO
 */
  passwordPatternValidator(): ValidatorFn {
/**
 * TODO: Documentation for return (method)
 * @param control - TODO
 * @returns TODO
 */
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\-€\._])[A-Za-z\d!@#\$%\^&\*\-€\._]{12,20}$/;
      return pattern.test(value) ? null : { invalidPasswordPattern: true };
    };
  }

/**
 * TODO: Documentation for toggleNewPasswordVisibility (method)
 * @returns TODO
 */
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

/**
 * TODO: Documentation for toggleConfirmPasswordVisibility (method)
 * @returns TODO
 */
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

/**
 * TODO: Documentation for onSubmitNewPassword (method)
 * @returns TODO
 */
  onSubmitNewPassword() {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched();
/**
 * TODO: Documentation for return (property)
 */
      return;
    }

    if (!this.userId || !this.email) {
      this.isError = true;
      this.message = this.translate.instant('feature.auth.***REMOVED***-component.form.submit.message.error.userinfo-not-available');
/**
 * TODO: Documentation for return (property)
 */
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;
    const payload = { userName: this.email, newPassword };

    this.authService.updatePassword(this.token, this.userId, payload)
      .pipe(
        tap(response => {
          this.isError = false;
          this.message = this.translate.instant('feature.auth.***REMOVED***-component.form.submit.message.success');

          if (this.token) {
            this.authService.deleteToken(this.token)
              .pipe(
                tap(() => console.log('Token was successfully removed'))
              )
              .subscribe();
          }

/**
 * TODO: Documentation for setTimeout (method)
 * @param ( - TODO
 * @returns TODO
 */
          setTimeout(() => {
            this.navigationService.navigateToLogin();
          }, 2000);
        })
      )
      .subscribe();
  }

/**
 * TODO: Documentation for markFormGroupTouched (method)
 * @returns TODO
 */
  private markFormGroupTouched() {
    Object.keys(this.resetForm.controls).forEach(key => {
      this.resetForm.get(key)?.markAsTouched();
    });
  }

  get newPasswordForm() { return this.resetForm.get('newPassword'); }
  get confirmPasswordForm() { return this.resetForm.get('confirmPassword'); }
  get passwordMismatchValidatorError() { return this.resetForm.hasError('passwordMismatch'); }
}
