import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PatientTableComponent } from './patient-table.component';
import { PatientStore } from '@app/features/dashboard/stores/patient.store';

describe('PatientTableComponent', () => {
  let component: PatientTableComponent;
  let fixture: ComponentFixture<PatientTableComponent>;

  const patientStoreMock = {
    patients: () => [],
    totalElements: () => 0,
    pageSize: () => 10,
    totalPages: () => 0,
    loading: () => false,
    load: jasmine.createSpy('load'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientTableComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
        { provide: PatientStore, useValue: patientStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});