import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDTO } from '@app/api/model'; 


@Component({
  selector: 'app-patient-analyse-diagnostic',
  templateUrl: './patient-analyse-diagnostic.component.html',
  styleUrls: ['./patient-analyse-diagnostic.component.scss']
})
export class PatientAnalyseDiagnosticComponent {
  readonly patient = input.required<PatientDTO>();
}
