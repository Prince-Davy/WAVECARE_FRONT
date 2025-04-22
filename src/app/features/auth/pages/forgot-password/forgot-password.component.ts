import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {RouterLink} from '@angular/router';
// import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-***REMOVED***',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    RouterLink,
    // ,ToastrModule
  ],
  templateUrl: './***REMOVED***.component.html',
  styleUrl: './***REMOVED***.component.scss'
})
export class ForgotPasswordComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
    // ,private toastr: ToastrService
  ) {
   this.form= this.fb.group({
      email: ['', [Validators.required, Validators.email]]
});
  }

  submit(): void {
    if (this.form.valid) {
      const email = this.form.value.email!;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          // this.toastr.success('Un email de réinitialisation a été envoyé.');
          this.form.reset();
        },
        error: () => {
         // this.toastr.error('Erreur lors de l’envoi. Vérifie l’adresse.');
        }
      });
    } else {
     // this.toastr.warning('Veuillez entrer une adresse email valide.');
    }
  }
}
