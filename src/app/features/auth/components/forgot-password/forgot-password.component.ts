import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './***REMOVED***.component.html',
  styleUrls: ['./***REMOVED***.component.scss']
})
export class ForgotPasswordComponent {
  form;
  resetRequestSuccess: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
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

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.resetRequestSuccess = true;
        this.form.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.log('Failure:', error);
        this.resetRequestSuccess = false;
      }
    });
  }
}
