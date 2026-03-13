import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientStore } from './patient.store';

describe('PatientStore', () => {
  let store: PatientStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientStore]
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
    expect(store.patients()).toEqual([]);
    expect(store.totalElements()).toBe(0);
    expect(store.loading()).toBeFalse();
  });

  it('load() should fetch patients and update signals', () => {
    store.load(0, 10, ['Dupont'], 'id', 'asc');

    const req = httpMock.expectOne(r => r.url === '/api/patients');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('id,asc');

    const filterParam = req.request.params.get('filter');
    expect(filterParam).not.toBeNull();
    const parsed = JSON.parse(filterParam!);
    expect(parsed.keywords).toEqual(['Dupont']);

    req.flush({ content: [{ id: 1, firstName: 'Jean', lastName: 'Dupont' }], totalElements: 1, totalPages: 1, size: 10 });

    expect(store.patients().length).toBe(1);
    expect(store.totalElements()).toBe(1);
  });
});
