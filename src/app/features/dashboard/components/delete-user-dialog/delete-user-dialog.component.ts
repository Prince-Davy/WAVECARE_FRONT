import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';


export interface DeleteUserDialogData {
  firstName: string;
  lastName: string;
  email: string;
}


@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule,TranslateModule],
  standalone: true,
})
export class DeleteUserDialogComponent {

constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogData,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

}
