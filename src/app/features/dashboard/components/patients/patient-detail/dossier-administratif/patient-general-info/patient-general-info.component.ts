import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientDTO } from '@app/api/model';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';

@Component({
  selector: 'app-patient-general-info',
  templateUrl: './patient-general-info.component.html',
  styleUrls: ['./patient-general-info.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NssFormatPipe]
})
export class PatientGeneralInfoComponent {
  readonly patient = input.required<PatientDTO>();
}