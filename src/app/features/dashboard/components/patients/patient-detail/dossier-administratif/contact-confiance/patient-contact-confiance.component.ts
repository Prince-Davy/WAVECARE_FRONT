/**
 * Patient Trusted Contact Component Module
 * 
 * Displays and allows editing of patient trusted contact information.
 * 
 * @module PatientContactConfianceComponent
 */
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
<<<<<<< Updated upstream
 * TODO: Documentation for PatientContactConfianceComponent (class)
 */
/**
 * TODO: Documentation for PatientContactConfianceComponent (class)
 */
/**
 * TODO: Documentation for PatientContactConfianceComponent (class)
=======
 * Patient Trusted Contact Component
 * 
 * Manages patient's trusted contact information including:
 * - Contact first name
 * - Contact last name
 * - Contact phone number
 * 
 * Supports view and edit modes with form validation.
 * 
 * @class PatientContactConfianceComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-contact-confiance',
  templateUrl: './patient-contact-confiance.component.html',
  styleUrls: ['./patient-contact-confiance.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule, PhoneFormatPipe]
})
export class PatientContactConfianceComponent {
  /**
   * Trusted contact data from patient record
   */
  readonly contactConfiance = input.required<PatientResponse['trustedContact']>();
  
  /**
   * Edit mode flag
   */
  readonly editMode = input(false);
  
  /**
   * Event emitted when contact information is updated
   */
  readonly update = output<Partial<PatientResponse['trustedContact']>>();

<<<<<<< Updated upstream
/**
 * TODO: Documentation for form (property)
 */
=======
  /**
   * Reactive form for editing trusted contact
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

<<<<<<< Updated upstream
/**
 * TODO: Documentation for submit (method)
 * @returns TODO
 */
=======
  /**
   * Submit trusted contact updates
   */
>>>>>>> Stashed changes
  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
