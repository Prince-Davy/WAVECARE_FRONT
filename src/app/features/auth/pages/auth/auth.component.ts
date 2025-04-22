// auth.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

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
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  
})
export class AuthComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  
  ) {
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
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
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      });
    }
  }
}