import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateAssistanceTicketDTO } from '@app/core/auth/models/assistance-ticket-dto';
import { AssistanceService } from '@app/core/auth/services/assistance.service';
import { TranslateModule } from '@ngx-translate/core';

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
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.scss']
})
export class AssistanceComponent {
  assistanceForm: FormGroup<any>;
  submissionSuccess: boolean | null = null;
  ticketCategories: string[] = [];

  constructor(private fb: FormBuilder, private assistanceService: AssistanceService) {
    this.assistanceForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]+$')]],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]+$')]],
      mail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    this.assistanceService.getTicketCategories().subscribe((categories) => this.ticketCategories = categories);
  }

  onSubmit() {
    if (this.assistanceForm.valid) {
      const ticketData: CreateAssistanceTicketDTO = {
        firstName: this.assistanceForm.value.firstName,
        lastName: this.assistanceForm.value.lastName,
        mail: this.assistanceForm.value.mail,
        category: this.assistanceForm.value.subject,
        content: this.assistanceForm.value.content
      } as CreateAssistanceTicketDTO;

      this.assistanceService.submitTicket(ticketData)
        .subscribe({
          next: (result) => {
            console.log('Ticket submitted successfully', result);
            this.submissionSuccess = true;
          },
          error: (error: HttpErrorResponse) => {
            console.error('An error occurred while trying to submit the ticket', error);
            this.submissionSuccess = false;
          }
        });
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
