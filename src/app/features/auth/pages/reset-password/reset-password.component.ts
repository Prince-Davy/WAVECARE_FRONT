import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatIcon } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  userId: string = '';
  email: string = '';
  isLoading = false;
  message = '';
  isError = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(20),
        this.passwordPatternValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token && this.token.trim() !== '') {
      this.loadUserInfoFromToken();
    } else {
      this.message = 'Lien invalide.';
      this.isError = true;
    }
  }

  loadUserInfoFromToken() {
    if (!this.token) return;

    this.isLoading = true;
    this.authService.getUserInfoFromToken(this.token).subscribe({
      next: (data) => {
        this.userId = data.id;
        this.email = data.email;
        this.isLoading = false;
        this.isError = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.message = 'Le lien de réinitialisation est invalide ou expiré.';
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
      this.message = 'Erreur: informations utilisateur non disponibles.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetForm.get('newPassword')?.value;
    const payload = { userName: this.email, newPassword };

    this.authService.updatePassword(this.userId, payload).subscribe({
      next: (response) => {
        console.log('✅ Mot de passe mis à jour avec succès:', response);
        this.isLoading = false;
        this.isError = false;
        this.message = 'Mot de passe réinitialisé avec succès. Redirection...';

        if (this.token) {
          this.authService.deleteToken(this.token).subscribe({
            next: () => console.log('✅ Token supprimé avec succès'),
            error: (error) => console.error('❌ Erreur lors de la suppression du token:', error)
          });
        }

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour du mot de passe:', error);
        this.isLoading = false;
        this.isError = true;
        this.message = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    switch (error.status) {
      case 400: return 'Les données fournies sont invalides.';
      case 401: return 'Le lien de réinitialisation est invalide ou expiré.';
      case 404: return 'Utilisateur non trouvé.';
      case 500: return 'Erreur serveur. Veuillez réessayer plus tard.';
      default: return 'Erreur lors de la réinitialisation du mot de passe.';
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.resetForm.controls).forEach(key => {
      this.resetForm.get(key)?.markAsTouched();
    });
  }

  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
  get passwordMismatch() { return this.resetForm.hasError('passwordMismatch'); }
}