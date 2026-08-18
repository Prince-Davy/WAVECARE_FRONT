/**
 * Patient Health Coverage Component Module
 * 
 * Displays and allows editing of patient health coverage and insurance information.
 * 
 * @module PatientCouvertureSanteComponent
 */
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
<<<<<<< Updated upstream
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
 */
/**
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
 */
/**
 * TODO: Documentation for PatientCouvertureSanteComponent (class)
=======
 * Patient Health Coverage Component
 * 
 * Displays and manages patient health coverage information including:
 * - Insurance provider name
 * - Policy number
 * 
 * Supports view and edit modes with form validation.
 * 
 * @class PatientCouvertureSanteComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-couverture-sante',
  templateUrl: './patient-couverture-sante.component.html',
  styleUrls: ['./patient-couverture-sante.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule]
})
export class PatientCouvertureSanteComponent {
  /**
   * Health coverage data from patient record
   */
  readonly couvertureSante = input.required<PatientResponse['healthCoverage']>();
  
  /**
   * Edit mode flag
   */
  readonly editMode = input(false);
  
  /**
   * Event emitted when coverage information is updated
   */
  readonly update = output<Partial<PatientResponse['healthCoverage']>>();

<<<<<<< Updated upstream
/**
 * TODO: Documentation for form (property)
 */
=======
  /**
   * Reactive form for editing health coverage
   */
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
=======
  /**
   * Submit health coverage updates
   */
>>>>>>> Stashed changes
  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
