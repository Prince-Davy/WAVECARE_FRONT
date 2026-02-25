import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientIdentiteComponent } from './patient-identite.component';
import { TranslateModule } from '@ngx-translate/core';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';

describe('PatientIdentiteComponent', () => {
  let component: PatientIdentiteComponent;
  let fixture: ComponentFixture<PatientIdentiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientIdentiteComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientIdentiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form when patient input changes including maritalStatus', () => {
    const patient: PatientDetailDto = {
      id: '123',
      firstName: 'A',
      lastName: 'C',
      ins: 'INS123',
      birthName: 'B',
      maritalName: 'X',
      maritalStatus: 'MARRIED',
      birthDate: new Date('2000-01-01'),
      birthPlace: 'L',
      nationality: 'FR',
      gender: 'FEMALE',
      address: 'Addr',
      phone: '000',
      email: 'e@e.com',
      nss: '123',
      trustedContact: { firstName: 'T', lastName: 'C', phone: '111' },
      healthCoverage: { insurance: 'I', policy: 'P' }
    };

    component.patient = patient;
    component.ngOnChanges({ patient: { currentValue: patient, firstChange: true, previousValue: null, isFirstChange: () => true } as any });
    expect(component.form.value.maritalStatus).toBe('MARRIED');
    expect(component.form.value.nss).toBe('123');
    expect(component.form.value.socialSecurityNumber).toBe('SSN789');
    expect(component.form.value.phone).toBe('000');
  });

  it('should expose maritalStatusOptions and translation helper returns proper key', () => {
    expect(component.maritalStatusOptions.length).toBe(5);
    expect(component.translateMaritalStatus('DIVORCED')).toBe('feature.dashboard.patient.detail.identite.form.maritalStatus.options.DIVORCED');
  });

  it('should expose genderOptions and translateGender works', () => {
    expect(component.genderOptions.length).toBe(4);
    expect(component.translateGender('OTHER')).toBe('feature.dashboard.patient.detail.identite.form.gender.options.OTHER');
  });
});