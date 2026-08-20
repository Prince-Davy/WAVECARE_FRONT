import { CommonModule } from '@angular/common';
import { Component, afterNextRender, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { TicketsService } from '@app/api/generated/tickets/tickets.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { finalize, tap } from 'rxjs';
import type { TicketDetailResponse, TicketStatus } from '@app/api/model';

/**
 * TODO: Documentation for TicketDialogData (interface)
 */
export interface TicketDialogData {
/**
 * TODO: Documentation for ticketDetailDTO (property)
 */
  ticketDetailDTO: TicketDetailResponse;
/**
 * TODO: Documentation for statuses (property)
 */
  statuses: TicketStatus[];
}

/**
 * TODO: Documentation for TicketDialogComponent (class)
 */
/**
 * TODO: Documentation for TicketDialogComponent (class)
 */
/**
 * TODO: Documentation for TicketDialogComponent (class)
 */
@Component({
  selector: 'app-ticket-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIcon,
    TranslateModule
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.scss'
})
export class TicketDialogComponent {



  readonly dialogRef = inject(MatDialogRef<TicketDialogComponent>);
  readonly data = inject<TicketDialogData>(MAT_DIALOG_DATA);
  readonly ticketDetailDTO = this.data.ticketDetailDTO;

/**
 * TODO: Documentation for ticketDialogForm (property)
 */
  ticketDialogForm: FormGroup<any>;
/**
 * TODO: Documentation for isSubmitting (property)
 */
  isSubmitting: boolean = false;

  readonly statusInput = viewChild.required<MatSelect>('statusInput');

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param ticketsApi - TODO
 * @param notificationService - TODO
 * @param translate - TODO
 * @returns TODO
 */

  constructor(
/**
 * TODO: Documentation for fb (property)
 */
    private fb: FormBuilder,
/**
 * TODO: Documentation for ticketsApi (property)
 */
    private ticketsApi: TicketsService,
/**
 * TODO: Documentation for notificationService (property)
 */
    private notificationService: NotificationService,
/**
 * TODO: Documentation for translate (property)
 */
    private translate: TranslateService
  ) {
    this.ticketDialogForm = this.fb.group({
/**
 * TODO: Documentation for status (property)
 */
      status: [this.data.ticketDetailDTO.statusId, [Validators.required]],
/**
 * TODO: Documentation for comment (property)
 */
      comment: [this.data.ticketDetailDTO.adminComment, [Validators.maxLength(500)]]
    });

/**
 * TODO: Documentation for afterNextRender (method)
 * @param () - TODO
 * @returns TODO
 */
    afterNextRender(() => this.statusInput().focus());
  }

/**
 * TODO: Documentation for validate (method)
 * @returns TODO
 */
  validate(): { id: number; statusId: number; adminComment: string } {
    const formValue = this.ticketDialogForm.value;
    const selectedStatus = this.data.statuses.find(s => s.id === formValue.status);
    return {
/**
 * TODO: Documentation for id (property)
 */
      id: this.data.ticketDetailDTO.id!,
/**
 * TODO: Documentation for statusId (property)
 */
      statusId: selectedStatus?.id ?? 0,
/**
 * TODO: Documentation for adminComment (property)
 */
      adminComment: formValue.comment ?? '',
    };
  }

/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
  submit(): void {
    if (this.ticketDialogForm.invalid || this.isSubmitting) {
      this.ticketDialogForm.markAllAsTouched();
/**
 * TODO: Documentation for return (property)
 */
      return;
    }

    this.isSubmitting = true;
    const payload = this.validate();
    this.ticketsApi
      .ticketUpdate(payload.id, {
/**
 * TODO: Documentation for statusId (property)
 */
        statusId: payload.statusId,
/**
 * TODO: Documentation for adminComment (property)
 */
        adminComment: payload.adminComment,
      })
      .pipe(
        tap(() => {
          this.notificationService.openSuccessSnackBar(
            this.translate.instant('feature.dashboard.ticket-table-component.table.column.action.message.success', {
/**
 * TODO: Documentation for id (property)
 */
              id: this.data.ticketDetailDTO.id
            })
          );
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(() => this.dialogRef.close(true));
  }

}
