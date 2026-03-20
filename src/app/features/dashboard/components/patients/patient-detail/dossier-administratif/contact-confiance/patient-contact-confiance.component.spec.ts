import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PatientContactConfianceComponent } from './patient-contact-confiance.component';

describe('PatientContactConfianceComponent', () => {
  let component: PatientContactConfianceComponent;
  let fixture: ComponentFixture<PatientContactConfianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientContactConfianceComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientContactConfianceComponent);
    fixture.componentRef.setInput('contactConfiance', {
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0102030405',
    } as any);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});