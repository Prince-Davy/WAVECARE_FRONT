import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.interface';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) { }

  getTickets(page = 0, size = 10): Observable<Page<Ticket>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<Ticket>>(this.apiUrl, { params });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  getTicketStatuses(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.apiUrl}/get-status`);
  }

  updateTicket(ticket: Ticket): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${ticket.id}`, { ticketStatus: ticket.status, adminComment: ticket.adminComment });
  }
}
