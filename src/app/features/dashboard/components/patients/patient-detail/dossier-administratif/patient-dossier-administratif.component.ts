/**
 * Patient Administrative File (Dossier Administratif) Component Module
 * 
 * Displays patient administrative information including identity, contacts, and health coverage.
 * Container component for administrative data sub-components.
 * 
 * @module PatientDossierAdministratifComponent
 */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientResponse } from '@app/api/model';
import { PatientIdentiteComponent } from './identite/patient-identite.component';
import { PatientContactConfianceComponent } from './contact-confiance/patient-contact-confiance.component';
import { PatientCouvertureSanteComponent } from './couverture-sante/patient-couverture-sante.component';

<<<<<<< Updated upstream

/**
 * TODO: Documentation for PatientDossierAdministratifComponent (class)
 */
/**
 * TODO: Documentation for PatientDossierAdministratifComponent (class)
 */
/**
 * TODO: Documentation for PatientDossierAdministratifComponent (class)
=======
/**
 * Patient Administrative File Component
 * 
 * Container for patient administrative information tabs/sections:
 * - Identity information (name, birth date, gender, marital status)
 * - Trusted contact information
 * - Health coverage details
 * 
 * @class PatientDossierAdministratifComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-dossier-administratif',
  templateUrl: './patient-dossier-administratif.component.html',
  styleUrls: ['./patient-dossier-administratif.component.scss'],
  standalone: true,
  imports: [CommonModule, PatientIdentiteComponent, PatientContactConfianceComponent, PatientCouvertureSanteComponent]
})
export class PatientDossierAdministratifComponent {
  /**
   * Patient data containing administrative information
   */
  readonly patient = input.required<PatientResponse>();
}
