import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDossierMedicalComponent } from './patient-dossier-medical.component';

describe('PatientDossierMedicalComponent', () => {
  let component: PatientDossierMedicalComponent;
  let fixture: ComponentFixture<PatientDossierMedicalComponent>;

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
      imports: [PatientDossierMedicalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDossierMedicalComponent);
    fixture.componentRef.setInput('patient', patientMock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});