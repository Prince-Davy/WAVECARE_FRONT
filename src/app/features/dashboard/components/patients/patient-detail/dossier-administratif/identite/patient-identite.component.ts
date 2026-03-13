import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientDTO } from '@app/api/model';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';
import { PhoneFormatPipe } from '@app/features/dashboard/pipes/phone-format.pipe';

@Component({
  selector: 'app-patient-identite',
  templateUrl: './patient-identite.component.html',
  styleUrls: ['./patient-identite.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule, NssFormatPipe, PhoneFormatPipe]
})
export class PatientIdentiteComponent {
  readonly patient = input.required<PatientDTO>();
  readonly editMode = input(false);
  readonly update = output<Partial<PatientDTO>>();

  form: FormGroup;

  // list of enum values coming from backend used for select options
  maritalStatusOptions = [
    { value: 'SINGLE', label: 'feature.dashboard.patient.detail.identite.form.maritalStatus.options.SINGLE' },
    { value: 'MARRIED', label: 'feature.dashboard.patient.detail.identite.form.maritalStatus.options.MARRIED' },
    { value: 'DIVORCED', label: 'feature.dashboard.patient.detail.identite.form.maritalStatus.options.DIVORCED' },
    { value: 'WIDOWED', label: 'feature.dashboard.patient.detail.identite.form.maritalStatus.options.WIDOWED' },
    { value: 'SEPARATED', label: 'feature.dashboard.patient.detail.identite.form.maritalStatus.options.SEPARATED' }
  ];

  genderOptions = [
    { value: 'MALE', label: 'feature.dashboard.patient.detail.identite.form.gender.options.MALE' },
    { value: 'FEMALE', label: 'feature.dashboard.patient.detail.identite.form.gender.options.FEMALE' },
    { value: 'OTHER', label: 'feature.dashboard.patient.detail.identite.form.gender.options.OTHER' },
    { value: 'UNKNOWN', label: 'feature.dashboard.patient.detail.identite.form.gender.options.UNKNOWN' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [''],
      birthName: [''],
      maritalName: [''],
      maritalStatus: [''],
      birthDate: [''],
      birthPlace: [''],
      nationality: [''],
      gender: [''],
      address: [''],
      phone: [''],
      email: [''],
      nss: ['']
    });

    effect(() => {
      const p = this.patient();
      if (p) {
        this.form.patchValue({
          firstName: p.firstName,
          birthName: p.birthName,
          maritalName: p.maritalName,
          maritalStatus: (p as any).maritalStatus,
          birthDate: p.birthDate,
          birthPlace: p.birthPlace,
          nationality: p.nationality,
          gender: p.gender,
          address: p.address,
          phone: p.phone,
          email: p.email,
          nss: p.nss
        });
      }
    });
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  /**
   * helper used by template to translate the current enum value
   */
  translateMaritalStatus(value?: string): string {
    if (!value) {
      return '';
    }
    return `feature.dashboard.patient.detail.identite.form.maritalStatus.options.${value}`;
  }

  translateGender(value?: string): string {
    if (!value) {
      return '';
    }
    return `feature.dashboard.patient.detail.identite.form.gender.options.${value}`;
  }
}
