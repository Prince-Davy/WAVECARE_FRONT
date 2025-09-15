import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { TicketStatusDTO } from '../../models/ticket-status-dto';
import { TicketDetailDTO } from '../../models/ticket-detail-dto';
import { TicketdetailUpdateDTO } from '../../models/ticket-detail-update-dto';

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

  constructor(private fb: FormBuilder) {
    this.ticketDialogForm = this.fb.group({
      status: [this.data.ticketDetailDTO.statusId, [Validators.required]],
      comment: [this.data.ticketDetailDTO.adminComment, [Validators.required, Validators.maxLength(500)]]
    })
  }

  validate(): TicketdetailUpdateDTO {
    this.data.ticketDetailDTO.statusId = this.ticketDialogForm.value.status ?? '';
    this.data.ticketDetailDTO.adminComment = this.ticketDialogForm.value.comment ?? '';
    return this.data.ticketDetailDTO;
  }
}