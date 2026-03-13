
import { Component, afterNextRender, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { UsersService } from '@app/api/generated/users/users.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { finalize, tap } from 'rxjs';
import type { UserDTO } from '@app/api/model';

export interface UserDialogData {
  user: UserDTO;
  roles: string[];
  mode?: 'create' | 'update';
}

// Backward compat alias
export type UserCreateDTO = UserDTO;

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIcon,
    MatDialogModule,
    TranslateModule
],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  readonly user = this.data.user;

  userDialogForm: FormGroup<any>;
  isSubmitting: boolean = false;

  readonly roleInput = viewChild.required<MatSelect>('roleInput');


  constructor(
    private fb: FormBuilder,
    private usersApi: UsersService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    const isCreate = this.data.mode === 'create';

    this.userDialogForm = this.fb.group({
      lastName: [this.data.user.lastName ?? '', Validators.required],
      firstName: [this.data.user.firstName ?? '', Validators.required],
      email: [{ value: this.data.user.email ?? '', disabled: !isCreate }, [Validators.required, Validators.email]],
      role: [this.data.user.role ?? this.data.roles?.[0] ?? '0', Validators.required]
    });

    afterNextRender(() => this.roleInput().focus());
  }

  validate(): UserDTO {
    const formValue = this.userDialogForm.getRawValue();

    if (this.data.mode === 'create') {
        return { firstName: formValue.firstName, lastName: formValue.lastName, email: formValue.email, role: formValue.role };
      }

    const updateUser = this.data.user;
    return { id: updateUser.id, firstName: formValue.firstName, lastName: formValue.lastName, role: formValue.role, email: updateUser.email };

    /*
    const selectedRoles = this.data.roles.find(s => s === formValue.role);

      this.data.user.role = selectedRoles ?? "0";
      this.data.user.lastName = formValue.lastName ?? '';
      this.data.user.firstName = formValue.firstName ?? '';  
      this.data.user.email = formValue.email ?? this.data.user.email;

      return this.data.user;
      */
  }

  submit(): void {
    if (this.userDialogForm.invalid || this.isSubmitting) {
      this.userDialogForm.markAllAsTouched();
      return;
    }

    const payload = this.validate();
    const isCreate = this.data.mode === 'create';
    const request$ = isCreate
      ? this.usersApi.createUser(payload)
      : this.usersApi.updateUser(payload.id!, {
          lastName: payload.lastName,
          firstName: payload.firstName,
          role: payload.role,
          email: payload.email,
        });

    this.isSubmitting = true;
    request$
      .pipe(
        tap(() => {
          const messageKey = isCreate
            ? 'feature.dashboard.user-table-component.action.create.message.success'
            : 'feature.dashboard.user-table-component.table.column.action.update.message.success';

          this.notificationService.openSuccessSnackBar(this.translate.instant(messageKey));
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(() => this.dialogRef.close(true));
  }
}
