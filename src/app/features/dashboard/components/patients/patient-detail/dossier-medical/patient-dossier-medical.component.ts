/**
 * Patient Medical File (Dossier Médical) Component Module
 * 
 * Displays patient medical records and health history information.
 * 
 * @module PatientDossierMedicalComponent
 */
import { Component, input } from '@angular/core';
import { PatientResponse } from '@app/api/model';
import { CommonModule } from '@angular/common';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for PatientDossierMedicalComponent (class)
 */
/**
 * TODO: Documentation for PatientDossierMedicalComponent (class)
 */
/**
 * TODO: Documentation for PatientDossierMedicalComponent (class)
=======
 * Patient Medical File Component
 * 
 * Displays patient's medical records, health history, and medical conditions.
 * 
 * @class PatientDossierMedicalComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-dossier-medical',
  templateUrl: './patient-dossier-medical.component.html',
  styleUrls: ['./patient-dossier-medical.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientDossierMedicalComponent {
  /**
   * Patient data containing medical information
   */
  readonly patient = input.required<PatientResponse>();
}
