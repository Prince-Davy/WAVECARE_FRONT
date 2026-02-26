import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { TicketDetailDTO } from '../models/ticket-detail-dto';
import { TicketDetailUpdateDTO } from '../models/ticket-detail-update-dto';
import { TicketStatusDTO } from '../models/ticket-status-dto';
import { TicketViewDTO } from '../models/ticket-view-dto';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrlTicket = `/api/tickets`;

  constructor(private http: HttpClient, private authTokenService: AuthTokenService) { }

	getTickets(
		page = 0,
		size = 10,
		listKeywords: string[],
		sortFields: { field: string; direction: 'asc' | 'desc' }[] = []
	): Observable<Page<TicketViewDTO>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size);

		listKeywords.forEach(keyword => {
			params = params.append('listKeywords', keyword);
		});

		sortFields.forEach(sort => {
			params = params.append('sort', `${sort.field},${sort.direction}`);
		});

		return this.http.get<Page<TicketViewDTO>>(this.apiUrlTicket, { params });
	}

  getTicket(id: number): Observable<TicketDetailDTO> {
    return this.http.get<TicketDetailDTO>(`${this.apiUrlTicket}/${id}`);
  
  }

  updateTicket(ticketDetailUpdateDTO: TicketDetailUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrlTicket}/${ticketDetailUpdateDTO.id}`, { statusId: ticketDetailUpdateDTO.statusId, adminComment: ticketDetailUpdateDTO.adminComment });
  }

  getTicketStatuses(): Observable<TicketStatusDTO[]> {
    return this.http.get<TicketStatusDTO[]>(`/api/ticket-statuses`);
  
  }
}
