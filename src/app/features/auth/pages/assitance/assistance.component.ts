import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {AssistanceService} from '../../../../core/auth/services/assistance.service';
import {SupportRequestModel} from '../../../../core/auth/models/support-request.model';
import {SupportRequestDto} from '../../../../core/auth/models/support-request.dto';

@Component({
  selector: 'app-assistance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.scss']
})
export class AssistanceComponent {
  assistanceForm : FormGroup<any>;
  submissionSuccess: boolean | null = null;

  constructor(private fb: FormBuilder, private assistanceService: AssistanceService) {
    this.assistanceForm = SupportRequestModel.createForm(this.fb);
  }

  onSubmit() {
    if (this.assistanceForm.valid) {
      const ticketData: SupportRequestDto = {
        firstName: this.assistanceForm.value.prenom,
        lastName: this.assistanceForm.value.nom,
        email: this.assistanceForm.value.email,
        subject: this.assistanceForm.value.objet,
        description: this.assistanceForm.value.description
      };

      this.assistanceService.submitTicket(ticketData).subscribe(
        response => {
          console.log('Ticket submitted successfully', response);
          this.submissionSuccess = true;
        },
        error => {
          console.error('Error submitting ticket', error);
          this.submissionSuccess = false;
        }
      );
    } else {
      this.submissionSuccess = false;
    }
  }

  getErrorMessage(field: string): string {
    const control = this.assistanceForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control?.hasError('pattern')) {
      return 'Format invalide';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }
    return '';
  }
}
