import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Ticket } from '@app/features/dashboard/models/ticket.interface';
import { TranslateModule } from '@ngx-translate/core';

export interface TicketDialogData {
  ticket: Ticket;
  statuses: string[];
}

@Component({
  selector: 'app-ticket-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.scss'
})
export class TicketDialogComponent {

  readonly dialogRef = inject(MatDialogRef<TicketDialogComponent>);
  readonly data = inject<TicketDialogData>(MAT_DIALOG_DATA);
  readonly ticket = this.data.ticket;

  ticketDialogForm: FormGroup<any>;

  constructor(private fb: FormBuilder) {
    this.ticketDialogForm = this.fb.group({
      status: [this.data.ticket.status, [Validators.required]],
      comment: [this.data.ticket.adminComment, [Validators.maxLength(500)]]
    })
  }

  validate(): Ticket {
    this.data.ticket.status = this.ticketDialogForm.value.status ?? '';
    this.data.ticket.adminComment = this.ticketDialogForm.value.comment ?? '';
    return this.data.ticket;
  }
}
