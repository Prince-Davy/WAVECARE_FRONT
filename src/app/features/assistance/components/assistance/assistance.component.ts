/**
 * Assistance (Support Request) Component Module
 * 
 * Provides a form for users to submit support requests and create support tickets.
 * Allows users to select ticket categories and describe their issues.
 * 
 * @module AssistanceComponent
 * @see {@link AssistanceComponent} for the component class
 */
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
import type { TicketCreateRequest } from '@app/api/model';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for AssistanceComponent (class)
 */
/**
 * TODO: Documentation for AssistanceComponent (class)
 */
/**
 * TODO: Documentation for AssistanceComponent (class)
=======
 * Assistance (Support Request) Component
 * 
 * Displays a form for creating support requests.
 * Allows users to:
 * - Select a ticket category
 * - Enter ticket title and description
 * - Submit their support request
 * 
 * Shows success/error feedback after submission.
 * 
 * @class AssistanceComponent
 * @standalone
>>>>>>> Stashed changes
 */
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
<<<<<<< Updated upstream
/**
 * TODO: Documentation for assistanceForm (property)
 */
  assistanceForm: FormGroup<any>;
/**
 * TODO: Documentation for submissionSuccess (property)
 */
=======
  /**
   * Reactive form for assistance/ticket creation
   */
  assistanceForm: FormGroup<any>;

  /**
   * Tracks submission result (null = not submitted, true = success, false = error)
   */
>>>>>>> Stashed changes
  submissionSuccess: boolean | null = null;

  /**
   * Ticket categories API service
   */
  private readonly categoriesService = inject(TicketCategoriesService);

  /**
   * Available ticket categories for selection
   */
  readonly ticketCategories = toSignal(this.categoriesService.ticketCategoryList(), { initialValue: [] });

  /**
   * This regex matches if :
   * - It has at least one letter (unicode letter)
   * - it doesn't contains two consecutive dashes (-)
   * - it doesn't contains two consecutive spaces
   * - It doesn't contains any special characters (only a dash '-')
   */
  private readonly NAME_REGEX: RegExp = /^(?=.*[\p{L}])(?!.* {2})(?!.*-{3})[\p{L}\- ]+$/u;

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param ticketsService - TODO
 * @returns TODO
 */
  constructor(private fb: FormBuilder, private ticketsService: TicketsService) {
    this.assistanceForm = this.fb.group({
/**
 * TODO: Documentation for lastName (property)
 */
      lastName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
/**
 * TODO: Documentation for firstName (property)
 */
      firstName: ['', [Validators.required, Validators.pattern(this.NAME_REGEX), Validators.maxLength(50)]],
/**
 * TODO: Documentation for mail (property)
 */
      mail: ['', [Validators.required, Validators.email]],
/**
 * TODO: Documentation for subject (property)
 */
      subject: ['', Validators.required],
/**
 * TODO: Documentation for content (property)
 */
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
    });
  }

/**
 * TODO: Documentation for onSubmit (method)
 * @returns TODO
 */
  onSubmit() {
    if (this.assistanceForm.valid) {
      const ticketData: TicketCreateRequest = {
/**
 * TODO: Documentation for firstName (property)
 */
        firstName: this.assistanceForm.value.firstName,
/**
 * TODO: Documentation for lastName (property)
 */
        lastName: this.assistanceForm.value.lastName,
/**
 * TODO: Documentation for mail (property)
 */
        mail: this.assistanceForm.value.mail,
/**
 * TODO: Documentation for categoryId (property)
 */
        categoryId: this.assistanceForm.value.subject,
/**
 * TODO: Documentation for description (property)
 */
        description: this.assistanceForm.value.content
      };

      this.ticketsService.ticketCreate(ticketData)
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
