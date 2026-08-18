/**
 * Patients Container Module
 * 
 * Container component that manages patient-related routes and views.
 * Acts as a layout component with router outlet for nested patient components.
 * 
 * @module PatientsComponent
 * @see {@link PatientDetailComponent} for individual patient details
 * @see {@link PatientTableComponent} for patient list view
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for PatientsComponent (class)
 */
/**
 * TODO: Documentation for PatientsComponent (class)
 */
/**
 * TODO: Documentation for PatientsComponent (class)
=======
 * Patients Container Component
 * 
 * Main container for patient management features.
 * Provides routing outlet for nested patient-related components:
 * - Patient list/table view
 * - Patient detail view
 * - Other patient-related sub-routes
 * 
 * The actual content is injected via router-outlet based on the current route.
 * 
 * @class PatientsComponent
 * @standalone
 * @example
 * // Route configuration
 * {
 *   path: 'patients',
 *   component: PatientsComponent,
 *   children: [
 *     { path: '', component: PatientTableComponent },
 *     { path: ':id', component: PatientDetailComponent }
 *   ]
 * }
>>>>>>> Stashed changes
 */
@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent {
  // Container: content is injected via router-outlet
}
