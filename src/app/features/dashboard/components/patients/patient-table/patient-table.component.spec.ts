import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PatientTableComponent } from './patient-table.component';
import { PatientStore } from '@app/features/dashboard/stores/patient.store';

describe('PatientTableComponent', () => {
  let component: PatientTableComponent;
  let fixture: ComponentFixture<PatientTableComponent>;
  let router: any;

  const patientStoreMock: any = {
    patients: () => [],
    totalElements: () => 0,
    pageSize: () => 10,
    totalPages: () => 0,
    loading: () => false,
    load: jasmine.createSpy('load'),
  };

  beforeEach(async () => {
    patientStoreMock.patients = () => [
      { id: 1, lastName: 'Dupont', firstName: 'Alice', ins: '123', birthDate: '30/10/1990' },
      { id: 2, lastName: 'Martin', firstName: 'Bob', ins: '456', birthDate: '12/05/2001' },
    ] as any[];
    patientStoreMock.totalElements = () => 2;
    patientStoreMock.pageSize = () => 10;
    patientStoreMock.loading = () => false;
    patientStoreMock.load.calls.reset?.();

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
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('maps patient birth dates and exposes stored rows', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].birthDate).toEqual(jasmine.any(Date));
    expect(component.resultsLength).toBe(2);
    expect(component.pageSize).toBe(10);
    expect(component.isLoading).toBeFalse();
  });

  it('refreshes on keyword changes and resets filters state', () => {
    component.keywordsChanged(['alice']);
    expect(patientStoreMock.load).toHaveBeenCalled();

    component.resetTable();
    expect(component.listKeywords).toEqual([]);
    expect(component.filters).toEqual({ keywords: [] });
    expect(patientStoreMock.load).toHaveBeenCalled();
  });

  it('navigates to patient detail and preserves query state', () => {
    spyOn(router, 'navigate');
    const patient = { id: 42 } as any;

    component.consultPatient(patient);

    expect(router.navigate).toHaveBeenCalledWith([42], {
      relativeTo: component.route,
      queryParamsHandling: 'preserve'
    });
  });

  it('invokes patientStore.load when filters change', () => {
    patientStoreMock.load.calls.reset();
    component.filtersChanged({});
    expect(patientStoreMock.load).toHaveBeenCalled();
  });
});