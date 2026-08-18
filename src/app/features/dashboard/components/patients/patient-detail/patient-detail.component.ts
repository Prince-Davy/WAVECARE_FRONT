
/**
 * Patient Detail Module
 * 
 * Displays comprehensive patient information across multiple tabbed views.
 * Includes administrative, medical, and diagnostic data sections.
 * 
 * @module PatientDetailComponent
 * @see {@link PatientDossierAdministratifComponent} for administrative data
 * @see {@link PatientDossierMedicalComponent} for medical records
 * @see {@link PatientAnalyseDiagnosticComponent} for diagnostic analysis
 */
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

/**
<<<<<<< Updated upstream
 * TODO: Documentation for PatientDetailComponent (class)
 */
/**
 * TODO: Documentation for PatientDetailComponent (class)
 */
/**
 * TODO: Documentation for PatientDetailComponent (class)
=======
 * Patient Detail Component
 * 
 * Main detail view for a single patient record.
 * Displays patient information in tabbed sections:
 * - Administrative (identity, contacts, health coverage)
 * - Medical (medical records and history)
 * - Diagnostic (analysis and diagnostic results)
 * 
 * Loads patient data reactively based on route parameters (patient ID).
 * 
 * @class PatientDetailComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, PatientDossierAdministratifComponent, PatientDossierMedicalComponent, PatientAnalyseDiagnosticComponent, TranslateModule, PatientGeneralInfoComponent, BreadcrumbComponent]
})
export class PatientDetailComponent {

  /**
   * Route information service for accessing route parameters
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Patients API service for fetching patient data
   */
  private readonly patientsService = inject(PatientsService);

  /**
   * Patient ID extracted from route parameters
   * Reactive signal that updates when route parameters change
   */
  private readonly patientId = computed(() => Number(this.route.snapshot.paramMap.get('id') || '0'));

  /**
   * Reactive resource for loading patient data
   * Automatically fetches patient data when patientId changes
   * @private
   */
  private readonly _patientResource = rxResource({
/**
 * TODO: Documentation for params (property)
 */
    params: () => this.patientId(),
/**
 * TODO: Documentation for stream (property)
 */
    stream: ({ params: id }) => this.patientsService.patientGetById(id),
  });

  /**
   * Patient data signal
   * Contains the currently displayed patient's information
   */
  readonly patient = computed<PatientResponse | undefined>(() => this._patientResource.value());

<<<<<<< Updated upstream
/**
 * TODO: Documentation for selectedTab (property)
 */
  selectedTab: 'administratif' | 'medical' | 'diagnostic' = 'administratif';
/**
 * TODO: Documentation for selectedIndex (property)
 */
=======
  /**
   * Currently selected tab identifier
   * Options: 'administratif', 'medical', 'diagnostic'
   */
  selectedTab: 'administratif' | 'medical' | 'diagnostic' = 'administratif';

  /**
   * Current tab index (0-based)
   * Used for Material tabs component synchronization
   */
>>>>>>> Stashed changes
  selectedIndex: number = 0;
}
