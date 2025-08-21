// auth.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
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
  ***REMOVED***Form: FormGroup;
  hidePassword = true;
  errorMessage: string | undefined;
  isLockoutModalOpen = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {

    this.***REMOVED***Form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
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
          // Handle successful ***REMOVED*** based on user role
          // const role = response.role;
          console.log("You are logged in");
          this.router.navigate(['/dashboard']);
          // switch (role) {
          //   case 'SUPER_ADMIN':
          //     this.router.navigate(['/super-admin-dashboard']);
          //     break;
          //   case 'MEDICAL_ADMIN':
          //     this.router.navigate(['/medical-admin-dashboard']);
          //     break;
          //   case 'HEALTH_PROFESSIONAL':
          //     this.router.navigate(['/health-professional-dashboard']);
          //     break;
          //   default:
          //     this.errorMessage = 'Unknown user role';
          // }
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
    this.router.navigate(['/***REMOVED***']);
  }

  goToAssistance() {
    this.isLockoutModalOpen = false;
    this.router.navigate(['/assistance']);
  }
}
