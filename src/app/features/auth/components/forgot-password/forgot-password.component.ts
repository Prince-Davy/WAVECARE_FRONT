
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { PATH_TO_ASSISTANCE } from '@app/app.routes';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

/**
 * TODO: Documentation for ForgotPasswordComponent (class)
 */
/**
 * TODO: Documentation for ForgotPasswordComponent (class)
 */
/**
 * TODO: Documentation for ForgotPasswordComponent (class)
 */
@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    RouterLink
],
  templateUrl: './***REMOVED***.component.html',
  styleUrls: ['./***REMOVED***.component.scss']
})
export class ForgotPasswordComponent {

  readonly PATH_TO_ASSISTANCE_FOR_HTML = `/${PATH_TO_ASSISTANCE}`;

/**
 * TODO: Documentation for form (property)
 */
  form: FormGroup;
/**
 * TODO: Documentation for resetRequestSuccess (property)
 */
  resetRequestSuccess: boolean | null = null;

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param authService - TODO
 * @returns TODO
 */
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
/**
 * TODO: Documentation for email (property)
 */
      email: ['', [Validators.required, Validators.email]]
    });
  }

/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
  submit(): void {
/**
 * TODO: Documentation for if (method)
 * @param this.form.invalid - TODO
 * @returns TODO
 */
    if (this.form.invalid) {
      this.form.get('email')?.markAsTouched();
      this.resetRequestSuccess = false;
/**
 * TODO: Documentation for return (property)
 */
      return;
    }

    const email = this.form.value.email!;

    this.authService.forgotPassword(email)
      .pipe(
/**
 * TODO: Documentation for tap (method)
 * @param response - TODO
 * @param response - TODO
 * @returns TODO
 */
        tap(response => {
          console.log('Success:', response);
          this.resetRequestSuccess = true;
          this.form.reset();
        })
      )
      .subscribe();
  }
}
