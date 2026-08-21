
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

  form: FormGroup;
  resetRequestSuccess: boolean | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.get('email')?.markAsTouched();
      this.resetRequestSuccess = false;
      return;
    }

    const email = this.form.value.email!;

    this.authService.forgotPassword(email)
      .pipe(
        tap(response => {
          console.log('Success:', response);
          this.resetRequestSuccess = true;
          this.form.reset();
        })
      )
      .subscribe();
  }
}
