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

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required]
    });

    effect(() => {
      const c = this.contactConfiance();
      if (c) {
        this.form.patchValue({
          firstName: c.firstName,
          lastName: c.lastName,
          phone: c.phone
        });
      }
    });
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
