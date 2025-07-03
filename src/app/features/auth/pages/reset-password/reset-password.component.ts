import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-***REMOVED***',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './***REMOVED***.component.html',
  styleUrls: ['./***REMOVED***.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  userId: string = '';
  email: string = '';
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
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
      next: () => {
        this.isLoading = false;
        this.isError = false;
        this.message = '***REMOVED*** réinitialisé avec succès. Redirection...';

        if (this.token) {
          this.authService.deleteToken(this.token).subscribe();
        }

        setTimeout(() => this.router.navigate(['/***REMOVED***']), 2000);
      },
      error: (error) => {
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
