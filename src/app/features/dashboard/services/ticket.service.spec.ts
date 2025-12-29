
// src/app/features/dashboard/services/ticket.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TicketService } from './ticket.service';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { environment } from 'src/environments/environment';

import { TicketDetailDTO } from '../models/ticket-detail-dto';
import { TicketDetailUpdateDTO } from '../models/ticket-detail-update-dto';
import { TicketStatusDTO } from '../models/ticket-status-dto';
import { TicketViewDTO } from '../models/ticket-view-dto';
import { Page } from '../models/page';

// Stub simple pour AuthTokenService
class AuthTokenServiceStub {
  getToken(): string {
    return 'jwt.token.value';
  }
}

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api`;
  const ticketsUrl = `${apiUrl}/tickets`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TicketService,
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
      ],
    });

    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'aucune requête n'est restée ouverte
    httpMock.verify();
  });

  it('getTickets() devrait appeler /tickets avec headers et params (page, size, listKeywords[], sort)', () => {
    const page = 2;
    const size = 25;
    const listKeywords = ['urgent', 'prod'];
    const sortFields = [
      { field: 'createdAt', direction: 'desc' as const },
      { field: 'priority', direction: 'asc' as const },
    ];

    let response: Page<TicketViewDTO> | undefined;
    service.getTickets(page, size, listKeywords, sortFields).subscribe((res) => (response = res));

    // Match de l'URL sans se tromper avec les query params
    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);
    expect(req.request.method).toBe('GET');

    // Headers
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt.token.value');

    // Params
    expect(req.request.params.get('page')).toBe(String(page));
    expect(req.request.params.get('size')).toBe(String(size));
    expect(req.request.params.getAll('listKeywords')).toEqual(listKeywords);
    expect(req.request.params.getAll('sort')).toEqual(['createdAt,desc', 'priority,asc']);

    // Réponse mockée
    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size,
    } as Page<TicketViewDTO>);

    expect(response).toBeDefined();
    expect(response?.size).toBe(size);
  });

  it('getTickets() sans sortFields ne doit pas envoyer de paramètre "sort"', () => {
    const listKeywords = ['foo'];
    service.getTickets(0, 10, listKeywords).subscribe();

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);
    expect(req.request.method).toBe('GET');

    // "sort" absent
    const sorts = req.request.params.getAll('sort');
    expect(sorts).toBeNull();

    // Les params page/size/listKeywords doivent être présents
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.getAll('listKeywords')).toEqual(['foo']);

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    } as Page<TicketViewDTO>);
  });

  it('getTickets() avec listKeywords vide ne doit pas envoyer "listKeywords"', () => {
    service.getTickets(0, 10, [], []).subscribe();

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === ticketsUrl);
    expect(req.request.method).toBe('GET');

    // "listKeywords" absent
    const keywords = req.request.params.getAll('listKeywords');
    expect(keywords).toBeNull();

    // params page/size présents
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');

    req.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    } as Page<TicketViewDTO>);
  });

  it('getTicket() devrait appeler /tickets/{id} avec le header Authorization', () => {
    const id = 123;
    let response: TicketDetailDTO | undefined;

    service.getTicket(id).subscribe((res) => (response = res));

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === `${ticketsUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt.token.value');

    req.flush({ id, statusId: 1, adminComment: 'ok' } as TicketDetailDTO);
    expect(response?.id).toBe(id);
    expect(response?.statusId).toBe(1);
    expect(response?.adminComment).toBe('ok');
  });

  it('updateTicket() devrait faire un PUT /tickets/{id} avec le body {statusId, adminComment} et retourner 204', () => {
    const payload: TicketDetailUpdateDTO = {
      id: 321,
      statusId: 2,
      adminComment: 'Résolu',
    };

    let completed = false;
    service.updateTicket(payload).subscribe({
      complete: () => {
        completed = true;
      },
    });

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'PUT' && r.url === `${ticketsUrl}/${payload.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt.token.value');
    expect(req.request.body).toEqual({
      statusId: payload.statusId,
      adminComment: payload.adminComment,
    });

    // Réponse "No Content"
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(completed).toBeTrue();
  });

  it('getTicketStatuses() devrait appeler /ticket-statuses avec le header Authorization', () => {
    let statuses: TicketStatusDTO[] | undefined;

    service.getTicketStatuses().subscribe((res) => (statuses = res));

    const req = httpMock.expectOne((r: HttpRequest<any>) => r.method === 'GET' && r.url === `${apiUrl}/ticket-statuses`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt.token.value');

    req.flush([
      { id: 1, label: 'Ouvert' },
      { id: 2, label: 'Fermé' },
    ] as TicketStatusDTO[]);

    expect(statuses).toBeDefined();
    expect(statuses?.length).toBe(2);
    expect(statuses?.[0]?.id).toBe(1);
    expect(statuses?.[1]?.label).toBe('Fermé');
  });
});
