import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TicketDetailDTO } from '../../models/ticket-detail-dto';
import { TicketDetailUpdateDTO } from '../../models/ticket-detail-update-dto';
import { TicketStatusDTO } from '../../models/ticket-status-dto';
import { MatIcon } from '@angular/material/icon';
import { TicketService } from '../../services/ticket.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { finalize, tap } from 'rxjs';

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
export class TicketDialogComponent implements AfterViewInit {



  readonly dialogRef = inject(MatDialogRef<TicketDialogComponent>);
  readonly data = inject<TicketDialogData>(MAT_DIALOG_DATA);
  readonly ticketDetailDTO = this.data.ticketDetailDTO;

  ticketDialogForm: FormGroup<any>;
  isSubmitting: boolean = false;

  @ViewChild('statusInput') statusInput!: MatSelect;


  ngAfterViewInit() {
    setTimeout(() => {
      this.statusInput.focus();
    })
  }


  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.ticketDialogForm = this.fb.group({
      status: [this.data.ticketDetailDTO.statusId, [Validators.required]],
      comment: [this.data.ticketDetailDTO.adminComment, [Validators.maxLength(500)]]
    })
  }

  validate(): TicketDetailUpdateDTO {
    const formValue = this.ticketDialogForm.value;
    const selectedStatus = this.data.statuses.find(s => s.id === formValue.status);
    this.data.ticketDetailDTO.statusId = selectedStatus?.id ?? 0;
    this.data.ticketDetailDTO.adminComment = formValue.comment ?? '';
    return this.data.ticketDetailDTO;
  }

  submit(): void {
    if (this.ticketDialogForm.invalid || this.isSubmitting) {
      this.ticketDialogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.validate();
    this.ticketService
      .updateTicket(payload)
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
