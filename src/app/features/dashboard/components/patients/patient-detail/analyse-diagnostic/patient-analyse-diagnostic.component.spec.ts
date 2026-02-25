import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAnalyseDiagnosticComponent } from './patient-analyse-diagnostic.component';

describe('PatientAnalyseDiagnosticComponent', () => {
  let component: PatientAnalyseDiagnosticComponent;
  let fixture: ComponentFixture<PatientAnalyseDiagnosticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAnalyseDiagnosticComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAnalyseDiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});