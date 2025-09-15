import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  readonly ticketDetailDTO = model(this.data.ticketDetailDTO);

  comment = new FormGroup({
    textarea: new FormControl(this.data.ticketDetailDTO.adminComment)
  });

  validate(): TicketdetailUpdateDTO {
    this.data.ticketDetailDTO.adminComment = this.comment.value.textarea ?? '';
    return this.data.ticketDetailDTO;
  }
}
