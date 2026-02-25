import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';

import { MatCard, MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-couverture-sante',
  templateUrl: './patient-couverture-sante.component.html',
  styleUrls: ['./patient-couverture-sante.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, TranslateModule]
})
export class PatientCouvertureSanteComponent implements OnChanges {
  @Input() couvertureSante!: PatientDetailDto['healthCoverage'];
  @Input() editMode = false;
  @Output() update = new EventEmitter<Partial<PatientDetailDto['healthCoverage']>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      insurance: ['', Validators.required],
      policy: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['couvertureSante'] && this.couvertureSante) {
      this.form.patchValue({
        insurance: this.couvertureSante.insurance,
        policy: this.couvertureSante.policy
      });
    }
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
