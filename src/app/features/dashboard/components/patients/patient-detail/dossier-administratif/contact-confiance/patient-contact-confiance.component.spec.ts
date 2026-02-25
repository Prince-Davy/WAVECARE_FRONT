import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientContactConfianceComponent } from './patient-contact-confiance.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PatientContactConfianceComponent', () => {
  let component: PatientContactConfianceComponent;
  let fixture: ComponentFixture<PatientContactConfianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientContactConfianceComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientContactConfianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});