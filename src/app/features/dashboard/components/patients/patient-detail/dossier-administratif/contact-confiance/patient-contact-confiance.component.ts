import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';

import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneFormatPipe } from '@app/features/dashboard/pipes/phone-format.pipe';

@Component({
  selector: 'app-patient-contact-confiance',
  templateUrl: './patient-contact-confiance.component.html',
  styleUrls: ['./patient-contact-confiance.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule,TranslateModule, PhoneFormatPipe]
})
export class PatientContactConfianceComponent implements OnChanges {
  @Input() contactConfiance!: PatientDetailDto['trustedContact'];
  @Input() editMode = false;
  @Output() update = new EventEmitter<Partial<PatientDetailDto['trustedContact']>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactConfiance'] && this.contactConfiance) {
      this.form.patchValue({
        firstName: this.contactConfiance.firstName,
        lastName: this.contactConfiance.lastName,
        phone: this.contactConfiance.phone
      });
    }
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
