
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { rxResource } from '@angular/core/rxjs-interop';
import { PatientsService } from '@app/api/generated/patients/patients.service';
import type { PatientResponse } from '@app/api/model';
import { PatientDossierAdministratifComponent } from './dossier-administratif/patient-dossier-administratif.component';
import { PatientDossierMedicalComponent } from './dossier-medical/patient-dossier-medical.component';
import { PatientAnalyseDiagnosticComponent } from './analyse-diagnostic/patient-analyse-diagnostic.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientGeneralInfoComponent } from './dossier-administratif/patient-general-info/patient-general-info.component';
import { BreadcrumbComponent } from '@app/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, PatientDossierAdministratifComponent, PatientDossierMedicalComponent, PatientAnalyseDiagnosticComponent, TranslateModule, PatientGeneralInfoComponent, BreadcrumbComponent]
})
export class PatientDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly patientsService = inject(PatientsService);

  private readonly patientId = computed(() => Number(this.route.snapshot.paramMap.get('id') || '0'));

  private readonly _patientResource = rxResource({
    params: () => this.patientId(),
    stream: ({ params: id }) => this.patientsService.patientGetById(id),
  });

  readonly patient = computed<PatientResponse | undefined>(() => this._patientResource.value());

  selectedTab: 'administratif' | 'medical' | 'diagnostic' = 'administratif';
  selectedIndex: number = 0;
}
