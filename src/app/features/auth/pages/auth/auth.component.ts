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
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';
  isLockoutModalOpen = false;
  lockoutMessage = '';
  submitted= false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router

  ) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required,strictEmailValidator]],
      password: ['', [Validators.required, Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#¤$@\\-_])[A-Za-z\\d#¤$@\\-_]{12,20}$'
          )
        ]
      ]
    });
  }
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted=true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Handle successful login based on user role
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
            this.lockoutMessage = error.error || "Suite à 5 tentatives de connexion infructueuses votre accès à l'application est bloqué.";
            this.isLockoutModalOpen = true;
          } else if (error.status === 401) {
            this.errorMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
          } else {
            this.errorMessage = 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
          }
        }
      });
    }
  }

  closeLockoutModal() {
    this.isLockoutModalOpen = false;
    this.router.navigate(['/login']);
  }

  goToAssistance() {
    this.isLockoutModalOpen = false;
    this.router.navigate(['/assistance']);
  }
}
