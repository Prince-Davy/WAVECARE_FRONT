
import { Component, afterNextRender, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators , AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
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
import type { UserResponse } from '@app/api/model';
import { CommonModule } from '@angular/common';

/**
 * TODO: Documentation for UserDialogData (interface)
 */
export interface UserDialogData {
/**
 * TODO: Documentation for user (property)
 */
  user: UserResponse;
/**
 * TODO: Documentation for roles (property)
 */
  roles: string[];
  mode?: 'create' | 'update';
}

// Backward compat alias
/**
 * TODO: Documentation for UserCreateDTO (type)
 */
export type UserCreateDTO = UserResponse;

/**
 * TODO: Documentation for UserDialogComponent (class)
 */
/**
 * TODO: Documentation for UserDialogComponent (class)
 */
/**
 * TODO: Documentation for UserDialogComponent (class)
 */

export function strictEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Validators.required gère le champ vide
    }

    const specialCharactersRegex = /[^a-zA-Z0-9.@_-]/;

    if (specialCharactersRegex.test(value)) {
      return { specialCharacters: true };
    }

    const emailFormatRegex = /^[a-zA-Z]+[a-zA-Z_-]*\.[a-zA-Z]+[a-zA-Z_-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    if (!emailFormatRegex.test(value)) {
      return { invalidEmailFormat: true };
    }

    return null;
  };
}
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
    TranslateModule,
    CommonModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  readonly user = this.data.user;

/**
 * TODO: Documentation for userDialogForm (property)
 */
  userDialogForm: FormGroup<any>;
/**
 * TODO: Documentation for isSubmitting (property)
 */
  isSubmitting: boolean = false;

  readonly roleInput = viewChild.required<MatSelect>('roleInput');

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @param usersApi - TODO
 * @param notificationService - TODO
 * @param translate - TODO
 * @returns TODO
 */

  constructor(
/**
 * TODO: Documentation for fb (property)
 */
    private fb: FormBuilder,
/**
 * TODO: Documentation for usersApi (property)
 */
    private usersApi: UsersService,
/**
 * TODO: Documentation for notificationService (property)
 */
    private notificationService: NotificationService,
/**
 * TODO: Documentation for translate (property)
 */
    private translate: TranslateService
  ) {
    const isCreate = this.data.mode === 'create';

    this.userDialogForm = this.fb.group({
/**
 * TODO: Documentation for lastName (property)
 */
      lastName: [this.data.user.lastName ?? '', Validators.required],
/**
 * TODO: Documentation for firstName (property)
 */
      firstName: [this.data.user.firstName ?? '', Validators.required],
/**
 * TODO: Documentation for email (property)
 */
    email:[
      { value: this.data.user.email ?? '', disabled: !isCreate },
      {
        validators: [
          Validators.required,
          strictEmailValidator()
        ],
         updateOn: 'blur' 
      }
    ],
/**
 * TODO: Documentation for role (property)
 */
      role: [this.data.user.role ?? this.data.roles?.[0] ?? '0', Validators.required]
    });

/**
 * TODO: Documentation for afterNextRender (method)
 * @param () - TODO
 * @returns TODO
 */
    afterNextRender(() => this.roleInput().focus());
  }

/**
 * TODO: Documentation for validate (method)
 * @returns TODO
 */
  validate(): UserResponse {
    const formValue = this.userDialogForm.getRawValue();

/**
 * TODO: Documentation for if (method)
 * @param this.data.mode - TODO
 * @returns TODO
 */
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

/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
  submit(): void {
/**
 * TODO: Documentation for if (method)
 * @param this.isSubmitting - TODO
 * @returns TODO
 */
    if (this.userDialogForm.invalid || this.isSubmitting) {
      this.userDialogForm.markAllAsTouched();
/**
 * TODO: Documentation for return (property)
 */
      return;
    }

    const payload = this.validate();
    const isCreate = this.data.mode === 'create';
    const request$ = isCreate
      ? this.usersApi.userCreate(payload)
      : this.usersApi.userUpdate(payload.id!, {
/**
 * TODO: Documentation for lastName (property)
 */
        lastName: payload.lastName,
/**
 * TODO: Documentation for firstName (property)
 */
        firstName: payload.firstName,
/**
 * TODO: Documentation for role (property)
 */
        role: payload.role
      });

    this.isSubmitting = true;
    request$
      .pipe(
/**
 * TODO: Documentation for tap (method)
 * @param ( - TODO
 * @returns TODO
 */
        tap(() => {
          const messageKey = isCreate
            ? 'feature.dashboard.user-table-component.action.create.message.success'
            : 'feature.dashboard.user-table-component.table.column.action.update.message.success';

          this.notificationService.openSuccessSnackBar(this.translate.instant(messageKey));
        }),
/**
 * TODO: Documentation for finalize (method)
 * @param ( - TODO
 * @returns TODO
 */
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(() => this.dialogRef.close(true));
  }
}
