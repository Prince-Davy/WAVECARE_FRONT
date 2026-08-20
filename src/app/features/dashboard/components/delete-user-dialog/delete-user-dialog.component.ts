import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

/**
 * TODO: Documentation for DeleteUserDialogData (interface)
 */

export interface DeleteUserDialogData {
/**
 * TODO: Documentation for firstName (property)
 */
  firstName: string;
/**
 * TODO: Documentation for lastName (property)
 */
  lastName: string;
/**
 * TODO: Documentation for email (property)
 */
  email: string;
}


/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
 */
/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
 */
/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
 */
@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule,TranslateModule],
  standalone: true,
})
export class DeleteUserDialogComponent {

/**
 * TODO: Documentation for constructor (method)
 * @param @Inject(MAT_DIALOG_DATA - TODO
 * @returns TODO
 */
constructor(
/**
 * TODO: Documentation for dialogRef (property)
 */
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogData,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>
  ) {}

/**
 * TODO: Documentation for onCancel (method)
 * @returns TODO
 */
  onCancel() {
    this.dialogRef.close(false);
  }

/**
 * TODO: Documentation for onConfirm (method)
 * @returns TODO
 */
  onConfirm() {
    this.dialogRef.close(true);
  }

}
