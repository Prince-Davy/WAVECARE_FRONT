import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCouvertureSanteComponent } from './patient-couverture-sante.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PatientCouvertureSanteComponent', () => {
  let component: PatientCouvertureSanteComponent;
  let fixture: ComponentFixture<PatientCouvertureSanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCouvertureSanteComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCouvertureSanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});