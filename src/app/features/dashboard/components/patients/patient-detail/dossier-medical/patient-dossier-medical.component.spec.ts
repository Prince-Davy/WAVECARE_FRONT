import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDossierMedicalComponent } from './patient-dossier-medical.component';

describe('PatientDossierMedicalComponent', () => {
  let component: PatientDossierMedicalComponent;
  let fixture: ComponentFixture<PatientDossierMedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDossierMedicalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDossierMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});