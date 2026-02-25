import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';

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
export class PatientIdentiteComponent implements OnChanges {
  @Input() patient!: PatientDetailDto;
  @Input() editMode = false;
  @Output() update = new EventEmitter<Partial<PatientDetailDto>>();

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient'] && this.patient) {
      this.form.patchValue({
        firstName: this.patient.firstName,
        birthName: this.patient.birthName,
        maritalName: this.patient.maritalName,
        maritalStatus: (this.patient as any).maritalStatus, // may be undefined when old data
        birthDate: this.patient.birthDate,
        birthPlace: this.patient.birthPlace,
        nationality: this.patient.nationality,
        gender: this.patient.gender,
        address: this.patient.address,
        phone: this.patient.phone,
        email: this.patient.email,
        nss: this.patient.nss
      });
    }
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
