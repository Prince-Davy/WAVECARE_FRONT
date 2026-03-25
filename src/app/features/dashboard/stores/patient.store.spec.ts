import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PatientStore } from './patient.store';

describe('PatientStore', () => {
  let store: PatientStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientStore],
    });

    store = TestBed.inject(PatientStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should start with empty state', () => {
    expect(store.pageSize()).toBe(10);
    expect(store.error()).toBeNull();
  });

  it('load() should fetch patients and update signals', fakeAsync(() => {
    store.load(0, 10, ['Dupont'], 'id', 'asc');
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === '/api/v1/patients');

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('id,asc');

    const filterParam = req.request.params.get('filter');
    expect(filterParam).not.toBeNull();

    const parsed = JSON.parse(filterParam!);
    expect(parsed.keywords).toEqual(['Dupont']);

    req.flush({
      content: [{ id: 1, firstName: 'Jean', lastName: 'Dupont' }],
      totalElements: 1,
      totalPages: 1,
      size: 10,
    });

    TestBed.flushEffects();

    expect(store.pageSize()).toBe(10);

  }));

  it('load() should still send filter when keywords are empty', fakeAsync(() => {
    store.load(0, 10, [], 'id', 'asc');
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === '/api/v1/patients');

    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('id,asc');

    const filterParam = req.request.params.get('filter');
    expect(filterParam).not.toBeNull();

    const parsed = JSON.parse(filterParam!);
    expect(parsed.keywords).toBeUndefined();

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });

    TestBed.flushEffects();

    expect(store.patients()).toEqual([]);
    expect(store.totalElements()).toBe(0);
  }));

  it('load() should not send sort when sortField or sortDirection is missing', () => {
    store.load(0, 10, ['Dupont'], undefined, undefined);
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === '/api/v1/patients');

    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.has('sort')).toBeFalse();

    const filterParam = req.request.params.get('filter');
    expect(filterParam).not.toBeNull();

    const parsed = JSON.parse(filterParam!);
    expect(parsed.keywords).toEqual(['Dupont']);

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });

    TestBed.flushEffects();
  });

  it('load() should merge advanced filters with keywords', () => {
    store.load(0, 10, ['Dupont'], 'id', 'asc', {
      birthDate: '01/01/2000',
    });
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === '/api/v1/patients');

    const filterParam = req.request.params.get('filter');
    expect(filterParam).not.toBeNull();

    const parsed = JSON.parse(filterParam!);
    expect(parsed.keywords).toEqual(['Dupont']);
    expect(parsed.birthDate).toBe('01/01/2000');

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });

    TestBed.flushEffects();
  });
});