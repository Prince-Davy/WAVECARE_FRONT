import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientResponse } from '@app/api/model';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';
import { PhoneFormatPipe } from '@app/features/dashboard/pipes/phone-format.pipe';

/**
 * TODO: Documentation for PatientIdentiteComponent (class)
 */
/**
 * TODO: Documentation for PatientIdentiteComponent (class)
 */
/**
 * TODO: Documentation for PatientIdentiteComponent (class)
 */
@Component({
  selector: 'app-patient-identite',
  templateUrl: './patient-identite.component.html',
  styleUrls: ['./patient-identite.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule, NssFormatPipe, PhoneFormatPipe]
})
export class PatientIdentiteComponent {
  readonly patient = input.required<PatientResponse>();
  readonly editMode = input(false);
  readonly update = output<Partial<PatientResponse>>();

/**
 * TODO: Documentation for form (property)
 */
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

/**
 * TODO: Documentation for constructor (method)
 * @param fb - TODO
 * @returns TODO
 */
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
/**
 * TODO: Documentation for firstName (property)
 */
      firstName: [''],
/**
 * TODO: Documentation for birthName (property)
 */
      birthName: [''],
/**
 * TODO: Documentation for maritalName (property)
 */
      maritalName: [''],
/**
 * TODO: Documentation for maritalStatus (property)
 */
      maritalStatus: [''],
/**
 * TODO: Documentation for birthDate (property)
 */
      birthDate: [''],
/**
 * TODO: Documentation for birthPlace (property)
 */
      birthPlace: [''],
/**
 * TODO: Documentation for nationality (property)
 */
      nationality: [''],
/**
 * TODO: Documentation for gender (property)
 */
      gender: [''],
/**
 * TODO: Documentation for address (property)
 */
      address: [''],
/**
 * TODO: Documentation for phone (property)
 */
      phone: [''],
/**
 * TODO: Documentation for email (property)
 */
      email: [''],
/**
 * TODO: Documentation for nss (property)
 */
      nss: ['']
    });

/**
 * TODO: Documentation for effect (method)
 * @param ( - TODO
 * @returns TODO
 */
    effect(() => {
      const p = this.patient();
/**
 * TODO: Documentation for if (method)
 * @param p - TODO
 * @returns TODO
 */
      if (p) {
        this.form.patchValue({
/**
 * TODO: Documentation for firstName (property)
 */
          firstName: p.firstName,
/**
 * TODO: Documentation for birthName (property)
 */
          birthName: p.birthName,
/**
 * TODO: Documentation for maritalName (property)
 */
          maritalName: p.maritalName,
/**
 * TODO: Documentation for maritalStatus (property)
 */
          maritalStatus: (p as any).maritalStatus,
/**
 * TODO: Documentation for birthDate (property)
 */
          birthDate: p.birthDate,
/**
 * TODO: Documentation for birthPlace (property)
 */
          birthPlace: p.birthPlace,
/**
 * TODO: Documentation for nationality (property)
 */
          nationality: p.nationality,
/**
 * TODO: Documentation for gender (property)
 */
          gender: p.gender,
/**
 * TODO: Documentation for address (property)
 */
          address: p.address,
/**
 * TODO: Documentation for phone (property)
 */
          phone: p.phone,
/**
 * TODO: Documentation for email (property)
 */
          email: p.email,
/**
 * TODO: Documentation for nss (property)
 */
          nss: p.nss
        });
      }
    });
  }

/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
  submit() {
/**
 * TODO: Documentation for if (method)
 * @param this.form.valid - TODO
 * @returns TODO
 */
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  /**
   * helper used by template to translate the current enum value
   */
/**
 * TODO: Documentation for translateMaritalStatus (method)
 * @param value? - TODO
 * @returns TODO
 */
  translateMaritalStatus(value?: string): string {
/**
 * TODO: Documentation for if (method)
 * @param !value - TODO
 * @returns TODO
 */
    if (!value) {
      return '';
    }
    return `feature.dashboard.patient.detail.identite.form.maritalStatus.options.${value}`;
  }

/**
 * TODO: Documentation for translateGender (method)
 * @param value? - TODO
 * @returns TODO
 */
  translateGender(value?: string): string {
/**
 * TODO: Documentation for if (method)
 * @param !value - TODO
 * @returns TODO
 */
    if (!value) {
      return '';
    }
    return `feature.dashboard.patient.detail.identite.form.gender.options.${value}`;
  }
}
