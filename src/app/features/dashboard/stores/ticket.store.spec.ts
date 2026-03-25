import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';


import { TicketStore } from './ticket.store';
import type { PageTicketResponse } from '@app/api/model';

describe('TicketStore', () => {
  let store: TicketStore;
  let httpMock: HttpTestingController;

  const ticketsUrl = '/api/v1/tickets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketStore],
    });

    store = TestBed.inject(TicketStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('load() devrait appeler /tickets avec params (page, size, listKeywords[], sort)', fakeAsync(() => {
    const page = 2;
    const size = 25;
    const listKeywords = ['urgent', 'prod'];
    const sortFields = [
      { field: 'createdAt', direction: 'desc' as const },
      { field: 'priority', direction: 'asc' as const },
    ];

    store.load(page, size, listKeywords, sortFields);
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === ticketsUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe(String(page));
    expect(req.request.params.get('size')).toBe(String(size));
    expect(req.request.params.getAll('listKeywords')).toEqual(listKeywords);
    expect(req.request.params.getAll('sort')).toEqual([
      'createdAt,desc',
      'priority,asc',
    ]);

    req.flush({
      content: [],
      totalElements: 42,
      totalPages: 2,
      number: page,
      size,
    } as PageTicketResponse);

    TestBed.flushEffects();

  }));

  it('load() sans sortFields ne doit pas envoyer de paramètre "sort"', fakeAsync(() => {
    store.load(0, 10, ['foo']);
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === ticketsUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.getAll('sort')).toBeNull();
    expect(req.request.params.getAll('listKeywords')).toEqual(['foo']);

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    } as PageTicketResponse);

    TestBed.flushEffects();
  }));

  it('load() avec listKeywords vide ne doit pas envoyer "listKeywords"', () => {
    store.load(0, 10, [], []);
    TestBed.flushEffects();

    const req = httpMock.expectOne((r) => r.url === ticketsUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.getAll('listKeywords')).toBeNull();

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    } as PageTicketResponse);

    TestBed.flushEffects();
  });
});