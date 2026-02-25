import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';
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
  @Input() patient!: PatientDetailDto;
}
