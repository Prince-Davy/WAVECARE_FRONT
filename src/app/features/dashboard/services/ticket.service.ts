import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketStatusDTO } from '../models/ticket-status-dto';
import { TicketViewDTO } from '../models/ticket-view-dto';
import { TicketDetailDTO } from '../models/ticket-detail-dto';
import { TicketdetailUpdateDTO } from '../models/ticket-detail-update-dto';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly apiUrlTicket = `${this.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  getTickets(page = 0, size = 10, listKeywords: string[]): Observable<Page<TicketViewDTO>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    listKeywords.forEach(keyword => {
      params = params.append('listKeywords', keyword);
    });

    return this.http.get<Page<TicketViewDTO>>(this.apiUrlTicket, { params });
  }

  getTicket(id: number): Observable<TicketDetailDTO> {
    return this.http.get<TicketDetailDTO>(`${this.apiUrlTicket}/${id}`);
  }

  updateTicket(ticketdetailUpdateDTO: TicketdetailUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrlTicket}/${ticketdetailUpdateDTO.id}`, { statusId: ticketdetailUpdateDTO.statusId, adminComment: ticketdetailUpdateDTO.adminComment });
  }

  getTicketStatuses(): Observable<TicketStatusDTO[]> {
    return this.http.get<TicketStatusDTO[]>(`${this.apiUrl}/statuses`);
  }
}
