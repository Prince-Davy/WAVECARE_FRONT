import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDossierAdministratifComponent } from './patient-dossier-administratif.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PatientDossierAdministratifComponent', () => {
  let component: PatientDossierAdministratifComponent;
  let fixture: ComponentFixture<PatientDossierAdministratifComponent>;

  const patientMock = {
    id: '1',
    firstName: 'A',
    lastName: 'B',
    ins: 'INS123',
    nss: '1234567890123',
    birthDate: '2000-01-01',
    birthName: '',
    maritalName: '',
    maritalStatus: 'SINGLE' as any,
    birthPlace: '',
    nationality: 'FR',
    gender: 'MALE' as any,
    address: '',
    phone: '0612345678',
    email: '',
    trustedContact: { firstName: '', lastName: '', phone: '' } as any,
    healthCoverage: { insurance: '', policy: '' } as any,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PatientDossierAdministratifComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDossierAdministratifComponent);
    fixture.componentRef.setInput('patient', patientMock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});