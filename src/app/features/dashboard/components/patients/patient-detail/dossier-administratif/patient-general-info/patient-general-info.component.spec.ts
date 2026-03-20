import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NssFormatPipe } from '@app/features/dashboard/pipes/nss-format.pipe';

import { PatientGeneralInfoComponent } from './patient-general-info.component';

describe('PatientGeneralInfoComponent', () => {
  let component: PatientGeneralInfoComponent;
  let fixture: ComponentFixture<PatientGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientGeneralInfoComponent, TranslateModule.forRoot(), NssFormatPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientGeneralInfoComponent);
    fixture.componentRef.setInput('patient', {
      id: '1',
      firstName: 'A',
      lastName: 'B',
      ins: 'INS123',
      nss: '1234567890123',
      birthDate: new Date(),
      birthName: '',
      maritalName: '',
      maritalStatus: '' as any,
      birthPlace: '',
      nationality: '',
      gender: '' as any,
      address: '',
      phone: '0612345678',
      email: '',
      trustedContact: { firstName: '', lastName: '', phone: '' } as any,
      healthCoverage: { insurance: '', policy: '' } as any,
    });

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});