import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
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
    if (this.form.valid) {
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
    } else {
      this.resetRequestSuccess = false;
    }
  }
}