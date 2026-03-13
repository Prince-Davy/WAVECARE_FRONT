import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientDTO } from '@app/api/model';

import { MatCard, MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-couverture-sante',
  templateUrl: './patient-couverture-sante.component.html',
  styleUrls: ['./patient-couverture-sante.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule]
})
export class PatientCouvertureSanteComponent {
  readonly couvertureSante = input.required<PatientDTO['healthCoverage']>();
  readonly editMode = input(false);
  readonly update = output<Partial<PatientDTO['healthCoverage']>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      insurance: ['', Validators.required],
      policy: ['', Validators.required]
    });

    effect(() => {
      const c = this.couvertureSante();
      if (c) {
        this.form.patchValue({
          insurance: c.insurance,
          policy: c.policy
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
