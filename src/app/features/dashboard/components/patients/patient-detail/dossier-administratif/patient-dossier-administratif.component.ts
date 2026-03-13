import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDTO } from '@app/api/model';
import { PatientIdentiteComponent } from './identite/patient-identite.component';
import { PatientContactConfianceComponent } from './contact-confiance/patient-contact-confiance.component';
import { PatientCouvertureSanteComponent } from './couverture-sante/patient-couverture-sante.component';


@Component({
  selector: 'app-patient-dossier-administratif',
  templateUrl: './patient-dossier-administratif.component.html',
  styleUrls: ['./patient-dossier-administratif.component.scss'],
  standalone: true,
  imports: [CommonModule, PatientIdentiteComponent, PatientContactConfianceComponent, PatientCouvertureSanteComponent]
})
export class PatientDossierAdministratifComponent {
  readonly patient = input.required<PatientDTO>();
}
