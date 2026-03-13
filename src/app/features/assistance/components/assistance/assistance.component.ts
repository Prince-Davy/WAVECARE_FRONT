
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TicketsService } from '@app/api/generated/tickets/tickets.service';
import { TicketCategoriesService } from '@app/api/generated/ticket-categories/ticket-categories.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import type { TicketCreateDTO } from '@app/api/model';

@Component({
  selector: 'app-assistance',
  standalone: true,
  imports: [
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

  private readonly categoriesService = inject(TicketCategoriesService);
  readonly ticketCategories = toSignal(this.categoriesService.getAllCategories(), { initialValue: [] });

  /**
   * This regex matches if :
   * - It has at least one letter (unicode letter)
   * - it doesn't contains two consecutive dashes (-)
   * - it doesn't contains two consecutive spaces
   * - It doesn't contains any special characters (only a dash '-')
   */
  private readonly NAME_REGEX: RegExp = /^(?=.*[\p{L}])(?!.* {2})(?!.*-{3})[\p{L}\- ]+$/u;

  constructor(private fb: FormBuilder, private ticketsService: TicketsService) {
    this.assistanceForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
      mail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
    });
  }

  onSubmit() {
    if (this.assistanceForm.valid) {
      const ticketData: TicketCreateDTO = {
        firstName: this.assistanceForm.value.firstName,
        lastName: this.assistanceForm.value.lastName,
        mail: this.assistanceForm.value.mail,
        categoryId: this.assistanceForm.value.subject,
        description: this.assistanceForm.value.content
      };

      this.ticketsService.createTicket(ticketData)
        .pipe(
          tap((result) => {
            console.log('Ticket submitted successfully', result);
            this.assistanceForm.reset();
            this.submissionSuccess = true;
          })
        )
        .subscribe();
    } else {
      this.submissionSuccess = false;
    }
  }
}
