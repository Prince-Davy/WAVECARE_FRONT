import { Component, input } from '@angular/core';
import { PatientDTO } from '@app/api/model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-dossier-medical',
  templateUrl: './patient-dossier-medical.component.html',
  styleUrls: ['./patient-dossier-medical.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientDossierMedicalComponent {
  readonly patient = input.required<PatientDTO>();
}
