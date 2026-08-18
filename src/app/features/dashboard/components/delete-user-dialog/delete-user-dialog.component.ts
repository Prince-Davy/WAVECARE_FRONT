/**
 * Delete User Dialog Module
 * 
 * Provides a confirmation dialog for user deletion operations.
 * Displays user information before final deletion confirmation.
 * 
 * @module DeleteUserDialogComponent
 * @see {@link DeleteUserDialogComponent} for the component class
 * @see {@link DeleteUserDialogData} for the dialog data interface
 */
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for DeleteUserDialogData (interface)
 */

=======
 * Data passed to the delete user dialog
 * 
 * Contains user information displayed in the confirmation dialog
 * before the user is deleted from the system.
 * 
 * @interface DeleteUserDialogData
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 */
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream

/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
 */
/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
 */
/**
 * TODO: Documentation for DeleteUserDialogComponent (class)
=======
/**
 * Delete User Dialog Component
 * 
 * Modal dialog that requests user confirmation before deleting a user account.
 * Displays the user's information (name and email) and provides:
 * - Cancel button to dismiss the dialog without deleting
 * - Delete button to confirm the deletion
 * 
 * @class DeleteUserDialogComponent
 * @standalone
 * @example
 * const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
 *   data: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com'
 *   }
 * });
 * 
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result) {
 *     // User confirmed deletion
 *   }
 * });
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  standalone: true,
})
export class DeleteUserDialogComponent {

<<<<<<< Updated upstream
/**
 * TODO: Documentation for constructor (method)
 * @param @Inject(MAT_DIALOG_DATA - TODO
 * @returns TODO
 */
constructor(
/**
 * TODO: Documentation for dialogRef (property)
 */
=======
  /**
   * Initialize the delete confirmation dialog
   * 
   * @constructor
   * @param {DeleteUserDialogData} data - User information to display in dialog
   * @param {MatDialogRef} dialogRef - Reference to the dialog for closing
   */
  constructor(
>>>>>>> Stashed changes
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogData,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>
  ) {}

<<<<<<< Updated upstream
/**
 * TODO: Documentation for onCancel (method)
 * @returns TODO
 */
=======
  /**
   * Handle cancel button click
   * Closes the dialog with false result, indicating user did not confirm deletion
   */
>>>>>>> Stashed changes
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
