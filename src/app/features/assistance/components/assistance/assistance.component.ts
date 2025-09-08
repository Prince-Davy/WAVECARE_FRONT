import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CreateAssistanceTicketDTO } from '@app/features/assistance/models/assistance-ticket-dto';
import { AssistanceService } from '@app/features/assistance/services/assistance.service';
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
    TranslateModule,
    RouterLink
  ],
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.scss']
})
export class AssistanceComponent {
  assistanceForm: FormGroup<any>;
  submissionSuccess: boolean | null = null;
  ticketCategories: string[] = [];

  /**
   * This regex matches if :
   * - It has at least one letter (unicode letter)
   * - it doesn't contains two consecutive dashes (-)
   * - it doesn't contains two consecutive spaces
   * - It doesn't contains any special characters (only a dash '-')
   */
  private readonly NAME_REGEX: RegExp = /^(?=.*[\p{L}])(?!.* {2})(?!.*-{3})[\p{L}\- ]+$/u;

  constructor(private fb: FormBuilder, private assistanceService: AssistanceService) {
    this.assistanceForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
      mail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
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
        description: this.assistanceForm.value.content
      } as CreateAssistanceTicketDTO;

      this.assistanceService.submitTicket(ticketData)
        .subscribe({
          next: (result) => {
            console.log('Ticket submitted successfully', result);
            this.assistanceForm.reset();
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
}
