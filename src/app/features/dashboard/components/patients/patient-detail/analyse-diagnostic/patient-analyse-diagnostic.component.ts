import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto'; 


@Component({
  selector: 'app-patient-analyse-diagnostic',
  templateUrl: './patient-analyse-diagnostic.component.html',
  styleUrls: ['./patient-analyse-diagnostic.component.scss']
})
export class PatientAnalyseDiagnosticComponent {
  @Input() patient!: PatientDetailDto;
}
