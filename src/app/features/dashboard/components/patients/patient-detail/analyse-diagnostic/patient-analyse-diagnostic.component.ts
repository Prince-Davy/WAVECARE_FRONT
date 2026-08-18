/**
 * Patient Analysis and Diagnostic Component Module
 * 
 * Displays patient diagnostic analysis and diagnostic results.
 * 
 * @module PatientAnalyseDiagnosticComponent
 */
import { Component, input } from '@angular/core';
import { PatientResponse } from '@app/api/model';

<<<<<<< Updated upstream

/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
 */
/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
 */
/**
 * TODO: Documentation for PatientAnalyseDiagnosticComponent (class)
=======
/**
 * Patient Analysis and Diagnostic Component
 * 
 * Displays patient's diagnostic analysis, test results, and diagnostic findings.
 * 
 * @class PatientAnalyseDiagnosticComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-analyse-diagnostic',
  templateUrl: './patient-analyse-diagnostic.component.html',
  styleUrls: ['./patient-analyse-diagnostic.component.scss']
})
export class PatientAnalyseDiagnosticComponent {
  /**
   * Patient data containing diagnostic information
   */
  readonly patient = input.required<PatientResponse>();
}
