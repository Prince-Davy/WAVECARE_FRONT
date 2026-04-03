import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import type { PatientResponse } from '@app/api/model';

import { PatientIdentiteComponent } from './patient-identite.component';

describe('PatientIdentiteComponent', () => {
  let component: PatientIdentiteComponent;
  let fixture: ComponentFixture<PatientIdentiteComponent>;

  const basePatient: PatientResponse = {
    id: 123,
    firstName: 'Base',
    lastName: 'Patient',
    ins: 'INS123',
    birthName: 'Birth',
    maritalName: 'Marital',
    maritalStatus: 'SINGLE' as any,
    birthDate: '2000-01-01',
    birthPlace: 'Paris',
    nationality: 'FR',
    gender: 'MALE' as any,
    address: 'Adresse',
    phone: '000',
    email: 'base@test.com',
    nss: '123',
    trustedContact: { firstName: 'T', lastName: 'C', phone: '111' } as any,
    healthCoverage: { insurance: 'I', policy: 'P' } as any,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientIdentiteComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientIdentiteComponent);
    fixture.componentRef.setInput('patient', basePatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form when patient input changes including maritalStatus', () => {
    const patient: PatientResponse = {
      id: 456,
      firstName: 'A',
      lastName: 'C',
      ins: 'INS123',
      birthName: 'B',
      maritalName: 'X',
      maritalStatus: 'MARRIED' as any,
      birthDate: '2000-01-01',
      birthPlace: 'L',
      nationality: 'FR',
      gender: 'FEMALE' as any,
      address: 'Addr',
      phone: '000',
      email: 'e@e.com',
      nss: '123',
      trustedContact: { firstName: 'T', lastName: 'C', phone: '111' } as any,
      healthCoverage: { insurance: 'I', policy: 'P' } as any,
    };

    fixture.componentRef.setInput('patient', patient);
    fixture.detectChanges();

    const formValue = component.form.getRawValue();

    expect(formValue.firstName).toBe('A');
    expect(formValue.birthName).toBe('B');
    expect(formValue.maritalName).toBe('X');
    expect(formValue.maritalStatus).toBe('MARRIED');
    expect(formValue.nss).toBe('123');
    expect(formValue.phone).toBe('000');
    expect(formValue.email).toBe('e@e.com');
  });

  it('should expose maritalStatusOptions and translation helper returns proper key', () => {
    expect(component.maritalStatusOptions.length).toBe(5);
    expect(component.translateMaritalStatus('DIVORCED')).toBe(
      'feature.dashboard.patient.detail.identite.form.maritalStatus.options.DIVORCED'
    );
  });

  it('should expose genderOptions and translateGender works', () => {
    expect(component.genderOptions.length).toBe(4);
    expect(component.translateGender('OTHER')).toBe(
      'feature.dashboard.patient.detail.identite.form.gender.options.OTHER'
    );
  });
});