import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './***REMOVED***.component.html',
  styleUrls: ['./***REMOVED***.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  userId: string = '';
  email: string = '';
  message: string | undefined;
  isError = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        this.passwordPatternValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator } as AbstractControlOptions);
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token && this.token.trim() !== '') {
      this.loadUserInfoFromToken();
    } else {
      // Doing this because during OnInit the translation service isn't loaded yet. Once its loaded, we can set the message.
      this.translate.onTranslationChange.subscribe(
        () => this.message = this.translate.instant('feature.auth.***REMOVED***-component.message.error.invalid-link')
      );
      this.isError = true;
    }
  }

  loadUserInfoFromToken() {
    if (!this.token) return;

    this.authService.getUserInfoFromToken(this.token).subscribe({
      next: (data) => {
        this.userId = data.id;
        this.email = data.email;
        this.isError = false;
      },
      error: (error) => {
        this.isError = true;
        this.message = this.translate.instant('feature.auth.***REMOVED***-component.message.error.expired-link');
        console.error('Error while trying to recover the user information from the token.', error);
      }
    });
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  passwordPatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\-€\._])[A-Za-z\d!@#\$%\^&\*\-€\._]{12,20}$/;
      return pattern.test(value) ? null : { invalidPasswordPattern: true };
    };
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmitNewPassword() {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.userId || !this.email) {
      this.isError = true;
      this.message = this.translate.instant('feature.auth.***REMOVED***-component.form.submit.message.error.userinfo-not-available');
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;
    const payload = { userName: this.email, newPassword };

    this.authService.updatePassword(this.userId, payload).subscribe({
      next: (response) => {
        this.isError = false;
        this.message = this.translate.instant('feature.auth.***REMOVED***-component.form.submit.message.success');

        if (this.token) {
          this.authService.deleteToken(this.token).subscribe({
            next: () => console.log('Token was successfully removed'),
            error: (error) => console.error('Error while trying to delete the token', error)
          });
        }

        setTimeout(() => {
          this.router.navigate(['/***REMOVED***']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error while trying to update password', error);
        this.isError = true;
        this.message = this.translate.instant('feature.auth.***REMOVED***-component.form.submit.message.error.technical');
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.resetForm.controls).forEach(key => {
      this.resetForm.get(key)?.markAsTouched();
    });
  }

  get newPasswordForm() { return this.resetForm.get('newPassword'); }
  get confirmPasswordForm() { return this.resetForm.get('confirmPassword'); }
  get passwordMismatchValidatorError() { return this.resetForm.hasError('passwordMismatch'); }
}
