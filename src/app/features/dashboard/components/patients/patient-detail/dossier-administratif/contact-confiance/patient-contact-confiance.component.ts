import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientResponse } from '@app/api/model';

import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneFormatPipe } from '@app/features/dashboard/pipes/phone-format.pipe';

/**
 * TODO: Documentation for PatientContactConfianceComponent (class)
 */
/**
 * TODO: Documentation for PatientContactConfianceComponent (class)
 */
/**
 * TODO: Documentation for PatientContactConfianceComponent (class)
 */
@Component({
  selector: 'app-patient-contact-confiance',
  templateUrl: './patient-contact-confiance.component.html',
  styleUrls: ['./patient-contact-confiance.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule, PhoneFormatPipe]
})
export class PatientContactConfianceComponent {
  readonly contactConfiance = input.required<PatientResponse['trustedContact']>();
  readonly editMode = input(false);
  readonly update = output<Partial<PatientResponse['trustedContact']>>();

/**
 * TODO: Documentation for form (property)
 */
  form: FormGroup;

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
      firstName: ['', Validators.required],
/**
 * TODO: Documentation for lastName (property)
 */
      lastName: ['', Validators.required],
/**
 * TODO: Documentation for phone (property)
 */
      phone: ['', Validators.required]
    });

/**
 * TODO: Documentation for effect (method)
 * @param ( - TODO
 * @returns TODO
 */
    effect(() => {
      const c = this.contactConfiance();
      if (c) {
        this.form.patchValue({
/**
 * TODO: Documentation for firstName (property)
 */
          firstName: c.firstName,
/**
 * TODO: Documentation for lastName (property)
 */
          lastName: c.lastName,
/**
 * TODO: Documentation for phone (property)
 */
          phone: c.phone
        });
      }
    });
  }

/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
