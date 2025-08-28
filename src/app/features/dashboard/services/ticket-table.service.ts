import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
}

export interface Ticket {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  category: string;
  content: string;
  status: string;
  ticketCreationDate?: string;
}

@Injectable({ providedIn: 'root' })
export class TicketTableService {
  private readonly apiUrl = 'http://localhost:8080/api/ticket/tickets';

  constructor(private http: HttpClient) { }

  getTickets(page = 0, size = 10): Observable<Page<Ticket>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<Ticket>>(this.apiUrl, { params, observe: 'response' })
      .pipe(
        map((resp: HttpResponse<Page<Ticket>>) => resp.body ? resp.body : this.getEmptyPage())
      );
  }

  private getEmptyPage(): Page<Ticket> {
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 0 } as Page<Ticket>
  }
}
