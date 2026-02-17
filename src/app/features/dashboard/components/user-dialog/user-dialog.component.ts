
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { UserDetailDTO } from '../../models/user-detail-dto';
import { UserDetailUpdateDTO } from '../../models/user-detail-update';

export interface UserDialogData {
  user: UserCreateDTO |UserDetailDTO;
  roles: string[];
  mode?: 'create' | 'update';
}

export interface UserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
    TranslateModule
],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  readonly user = this.data.user;

  userDialogForm: FormGroup<any>;

  @ViewChild('roleInput') roleInput!: MatSelect;


  ngAfterViewInit() {
    setTimeout(() => {
      this.roleInput.focus();
    })
  }


  constructor(private fb: FormBuilder) {
    const isCreate = this.data.mode === 'create';

    this.userDialogForm = this.fb.group({
      lastName: [this.data.user.lastName ?? '', Validators.required],
      firstName: [this.data.user.firstName ?? '', Validators.required],
      email: [{ value: this.data.user.email ?? '', disabled: !isCreate }, [Validators.required, Validators.email]],
      role: [this.data.user.role ?? this.data.roles?.[0] ?? '0', Validators.required]
    });
  }

  validate():  UserCreateDTO | UserDetailUpdateDTO {
    const formValue = this.userDialogForm.getRawValue();

    if (this.data.mode === 'create') {
        return { firstName: formValue.firstName, lastName: formValue.lastName, email: formValue.email, role: formValue.role };
      }

    const updateUser = this.data.user as UserDetailUpdateDTO;
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
}
