
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientService } from '@app/features/dashboard/services/patient.service';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';
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
export class PatientDetailComponent implements OnInit {
  patient: PatientDetailDto | undefined;
  selectedTab: 'administratif' | 'medical' | 'diagnostic' = 'administratif';
  selectedIndex: number = 0;

  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.patientService.getPatientDetail(id).subscribe(patient => {
      this.patient = patient;
    });
  }
}
