import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';

import { PatientGeneralInfoComponent } from './patient-general-info.component';

describe('PatientGeneralInfoComponent', () => {
  let component: PatientGeneralInfoComponent;
  let fixture: ComponentFixture<PatientGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientGeneralInfoComponent, TranslateModule.forRoot(), NssFormatPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted nss when patient provided', () => {
    component.patient = { id: '1', firstName: 'A', lastName: 'B', ins: 'INS123', nss: '1234567890123', birthDate: new Date(), birthName: '', maritalName: '', maritalStatus: '', birthPlace: '', nationality: '', gender: '', address: '', phone: '0612345678', email: '', trustedContact: { firstName: '', lastName: '', phone: '' }, healthCoverage: { insurance: '', policy: '' } };
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('1 23 45 67 89 01 23');
    expect(text).toContain('06 12 34 56 78');
  });
});