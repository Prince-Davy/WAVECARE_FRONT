import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { TicketStore } from './ticket.store';
import { PagedTicketDTO } from '@app/api/model';

describe('TicketStore', () => {
  let store: TicketStore;
  let httpMock: HttpTestingController;
  const ticketsUrl = '/api/tickets';

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

  it('should start with empty state', () => {
    expect(store.tickets()).toEqual([]);
    expect(store.totalElements()).toBe(0);
    expect(store.loading()).toBeFalse();
  });

  it('load() devrait appeler /tickets avec params (page, size, listKeywords[], sort)', () => {
    const page = 2;
    const size = 25;
    const listKeywords = ['urgent', 'prod'];
    const sortFields = [
      { field: 'createdAt', direction: 'desc' as const },
      { field: 'priority', direction: 'asc' as const },
    ];

    store.load(page, size, listKeywords, sortFields);

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);

    expect(req.request.params.get('page')).toBe(String(page));
    expect(req.request.params.get('size')).toBe(String(size));
    expect(req.request.params.getAll('listKeywords')).toEqual(listKeywords);
    expect(req.request.params.getAll('sort')).toEqual(['createdAt,desc', 'priority,asc']);

    req.flush({
      content: [],
      totalElements: 42,
      totalPages: 2,
      number: page,
      size,
    } as PagedTicketDTO);

    expect(store.totalElements()).toBe(42);
    expect(store.pageSize()).toBe(size);
  });

  it('load() sans sortFields ne doit pas envoyer de paramètre "sort"', () => {
    store.load(0, 10, ['foo']);

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);
    expect(req.request.params.getAll('sort')).toBeNull();
    expect(req.request.params.getAll('listKeywords')).toEqual(['foo']);

    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 } as PagedTicketDTO);
  });

  it('load() avec listKeywords vide ne doit pas envoyer "listKeywords"', () => {
    store.load(0, 10, [], []);

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);
    expect(req.request.params.getAll('listKeywords')).toBeNull();

    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 } as PagedTicketDTO);
  });
});
