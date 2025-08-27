import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Ticket {
  id: number;
  firstName: string | null;
  lastName: string | null;
  mail: string | null;
  category: string | null;
  content: string | null;
  status: string | null;
  ticketCreationDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TicketTableService {
  private readonly apiUrl = 'http://localhost:8080/api/ticket/tickets';

  constructor(private http: HttpClient) {}

  getTickets(
    page = 0,
    size = 10,
    sort?: string[]
  ): Observable<{ page: Page<Ticket>; totalCount: number; links?: string }> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    sort?.forEach(s => (params = params.append('sort', s)));

    return this.http
      .get<Page<Ticket> | Ticket[]>(this.apiUrl, { params, observe: 'response' })
      .pipe(
        map((resp: HttpResponse<Page<Ticket> | Ticket[]>) => {
          const links = resp.headers.get('Link') || undefined;

          const headerTotal = resp.headers.get('X-Total-Count');
          const totalFromHeader = headerTotal != null ? Number(headerTotal) : undefined;

          let bodyPage: Page<Ticket>;

          if (Array.isArray(resp.body)) {
            const total = totalFromHeader ?? resp.body.length;
            bodyPage = {
              content: resp.body,
              totalElements: total,
              totalPages: Math.max(1, Math.ceil(total / size)),
              number: page,
              size
            };
          } else {
            bodyPage = resp.body as Page<Ticket>;
            bodyPage = {
              content: bodyPage.content ?? [],
              totalElements: totalFromHeader ?? bodyPage.totalElements ?? 0,
              totalPages: bodyPage.totalPages ?? (totalFromHeader != null ? Math.max(1, Math.ceil(totalFromHeader / size)) : 0),
              number: (bodyPage as any).number ?? page,
              size: bodyPage.size ?? size
            };
          }

          return {
            page: bodyPage,
            totalCount: bodyPage.totalElements,
            links
          };
        })
      );
  }
}