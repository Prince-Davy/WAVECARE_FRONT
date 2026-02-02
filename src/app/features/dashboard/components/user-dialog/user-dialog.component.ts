
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
  userDetailDTO: UserDetailDTO;
  roles: string[];
  mode?: 'create' | 'update';
}

@Component({
  selector: 'app-user-dialog',
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
    TranslateModule
],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  readonly userDetailDTO = this.data.userDetailDTO;

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
      lastName: [this.data.userDetailDTO.lastName, [Validators.required]],
      firstName: [this.data.userDetailDTO.firstName, [Validators.required]],
      email: [{ value: this.data.userDetailDTO.email, disabled: !isCreate }, [Validators.required, Validators.email]],
      role: [this.data.userDetailDTO.role, [Validators.required]]
    });
  }

  validate(): UserDetailUpdateDTO {
    const formValue = this.userDialogForm.getRawValue();
    const selectedRoles = this.data.roles.find(s => s === formValue.role);
    this.data.userDetailDTO.role = selectedRoles ?? "0";
    this.data.userDetailDTO.lastName = formValue.lastName ?? '';
    this.data.userDetailDTO.firstName = formValue.firstName ?? '';  
    this.data.userDetailDTO.email = formValue.email ?? this.data.userDetailDTO.email;

    return this.data.userDetailDTO;
  }
}
