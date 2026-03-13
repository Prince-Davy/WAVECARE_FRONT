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
import type { TicketDetailDTO, TicketStatusDTO } from '@app/api/model';

export interface TicketDialogData {
  ticketDetailDTO: TicketDetailDTO;
  statuses: TicketStatusDTO[];
}

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

  ticketDialogForm: FormGroup<any>;
  isSubmitting: boolean = false;

  readonly statusInput = viewChild.required<MatSelect>('statusInput');


  constructor(
    private fb: FormBuilder,
    private ticketsApi: TicketsService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.ticketDialogForm = this.fb.group({
      status: [this.data.ticketDetailDTO.statusId, [Validators.required]],
      comment: [this.data.ticketDetailDTO.adminComment, [Validators.maxLength(500)]]
    });

    afterNextRender(() => this.statusInput().focus());
  }

  validate(): { id: number; statusId: number; adminComment: string } {
    const formValue = this.ticketDialogForm.value;
    const selectedStatus = this.data.statuses.find(s => s.id === formValue.status);
    return {
      id: this.data.ticketDetailDTO.id!,
      statusId: selectedStatus?.id ?? 0,
      adminComment: formValue.comment ?? '',
    };
  }

  submit(): void {
    if (this.ticketDialogForm.invalid || this.isSubmitting) {
      this.ticketDialogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.validate();
    this.ticketsApi
      .updateTicketDetail(payload.id, {
        statusId: payload.statusId,
        adminComment: payload.adminComment,
      })
      .pipe(
        tap(() => {
          this.notificationService.openSuccessSnackBar(
            this.translate.instant('feature.dashboard.ticket-table-component.table.column.action.message.success', {
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
