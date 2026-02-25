import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDossierAdministratifComponent } from './patient-dossier-administratif.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PatientDossierAdministratifComponent', () => {
  let component: PatientDossierAdministratifComponent;
  let fixture: ComponentFixture<PatientDossierAdministratifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDossierAdministratifComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDossierAdministratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});