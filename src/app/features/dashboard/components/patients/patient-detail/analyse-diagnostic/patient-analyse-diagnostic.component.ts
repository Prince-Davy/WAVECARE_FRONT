import { Component, input } from '@angular/core';
import { PatientResponse } from '@app/api/model';


/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
 */
/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
 */
/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
 */
@Component({
  selector: 'app-patient-analyse-diagnostic',
  templateUrl: './patient-analyse-diagnostic.component.html',
  styleUrls: ['./patient-analyse-diagnostic.component.scss']
})
export class PatientAnalyseDiagnosticComponent {
  readonly patient = input.required<PatientResponse>();
}
