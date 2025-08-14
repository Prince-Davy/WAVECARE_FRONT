import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@app/core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
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
        console.log('Réponse reçue:', response);
        this.resetRequestSuccess = true;
        this.form.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur:', error);
        
        if (error.status === 200) {
          console.log('Statut 200 reçu comme erreur, traitant comme succès');
          this.resetRequestSuccess = true;
          this.form.reset();
        } else {
          this.resetRequestSuccess = false;
        }
      }
    });
  }
}
