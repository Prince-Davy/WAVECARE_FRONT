// auth.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/auth/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {strictEmailValidator} from '../../../../../shared/validators/strictEmailValidator';

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
    RouterLink
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',

})
export class AuthComponent {
  ***REMOVED***Form: FormGroup;
  hidePassword = true;
  errorMessage: string = '';
  submitted= false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router

  ) {

    this.***REMOVED***Form = this.fb.group({
      username: ['', [Validators.required,strictEmailValidator]],
      password: ['', [Validators.required, Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#¤$@\\-_])[A-Za-z\\d#¤$@\\-_]{12,20}$'
          )
        ]
      ]
    });
  }
  get username() {
    return this.***REMOVED***Form.get('username');
  }

  get password() {
    return this.***REMOVED***Form.get('password');
  }

  onSubmit() {
    this.submitted=true;
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
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      });
    }
  }

  goToHelp() {
    this.router.navigate(['/assistance']);
  }
}
