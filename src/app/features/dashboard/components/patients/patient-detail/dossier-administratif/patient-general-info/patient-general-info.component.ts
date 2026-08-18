/**
 * Patient General Information Component Module
 * 
 * Displays general patient information in read-only format.
 * 
 * @module PatientGeneralInfoComponent
 */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientResponse } from '@app/api/model';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for PatientGeneralInfoComponent (class)
 */
/**
 * TODO: Documentation for PatientGeneralInfoComponent (class)
 */
/**
 * TODO: Documentation for PatientGeneralInfoComponent (class)
=======
 * Patient General Information Component
 * 
 * Displays patient's general information in read-only view:
 * - Patient name
 * - Date of birth
 * - Social security number (NSS)
 * - Contact information
 * - Other general demographics
 * 
 * @class PatientGeneralInfoComponent
 * @standalone
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patient-general-info',
  templateUrl: './patient-general-info.component.html',
  styleUrls: ['./patient-general-info.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NssFormatPipe]
})
export class PatientGeneralInfoComponent {
  /**
   * Patient data containing general information
   */
  readonly patient = input.required<PatientResponse>();
}