import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import type { UserResponse } from '@app/api/model';


export interface ConfirmUsersActionDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: ThemePalette;
  users: UserResponse[];
}

@Component({
  selector: 'app-comfirm-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './comfirm-user-dialog.component.html',
  styleUrl: './comfirm-user-dialog.component.scss',
})
export class ComfirmUserDialogComponent {
  readonly data = inject<ConfirmUsersActionDialogData>(MAT_DIALOG_DATA);
}
