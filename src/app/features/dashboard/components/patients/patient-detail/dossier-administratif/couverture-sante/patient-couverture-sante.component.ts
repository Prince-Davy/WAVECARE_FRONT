import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientResponse } from '@app/api/model';

import { MatCard, MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

/**
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
 */
/**
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
 */
/**
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
 */
@Component({
  selector: 'app-patient-couverture-sante',
  templateUrl: './patient-couverture-sante.component.html',
  styleUrls: ['./patient-couverture-sante.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule]
})
export class PatientCouvertureSanteComponent {
  readonly couvertureSante = input.required<PatientResponse['healthCoverage']>();
  readonly editMode = input(false);
  readonly update = output<Partial<PatientResponse['healthCoverage']>>();

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
 * TODO: Documentation for insurance (property)
 */
      insurance: ['', Validators.required],
/**
 * TODO: Documentation for policy (property)
 */
      policy: ['', Validators.required]
    });

/**
 * TODO: Documentation for effect (method)
 * @param ( - TODO
 * @returns TODO
 */
    effect(() => {
      const c = this.couvertureSante();
/**
 * TODO: Documentation for if (method)
 * @param c - TODO
 * @returns TODO
 */
      if (c) {
        this.form.patchValue({
/**
 * TODO: Documentation for insurance (property)
 */
          insurance: c.insurance,
/**
 * TODO: Documentation for policy (property)
 */
          policy: c.policy
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
}
