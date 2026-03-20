import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PatientCouvertureSanteComponent } from './patient-couverture-sante.component';

describe('PatientCouvertureSanteComponent', () => {
  let component: PatientCouvertureSanteComponent;
  let fixture: ComponentFixture<PatientCouvertureSanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCouvertureSanteComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCouvertureSanteComponent);
    fixture.componentRef.setInput('couvertureSante', {
      insurance: 'Mutuelle',
      policy: 'POL123',
    } as any);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});