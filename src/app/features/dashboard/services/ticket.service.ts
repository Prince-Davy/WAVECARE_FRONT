import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketDetailDTO } from '../models/ticket-detail-dto';
import { TicketDetailUpdateDTO } from '../models/ticket-detail-update-dto';
import { TicketStatusDTO } from '../models/ticket-status-dto';
import { TicketViewDTO } from '../models/ticket-view-dto';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly apiUrlTicket = `${this.apiUrl}/tickets`;

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

		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`,
		});

		return this.http.get<Page<TicketViewDTO>>(this.apiUrlTicket, { headers, params });
	}

  getTicket(id: number): Observable<TicketDetailDTO> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authTokenService.getToken()}`
    });

    return this.http.get<TicketDetailDTO>(`${this.apiUrlTicket}/${id}`, { headers });
  }

  updateTicket(ticketDetailUpdateDTO: TicketDetailUpdateDTO): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authTokenService.getToken()}`
    });

    return this.http.put<void>(`${this.apiUrlTicket}/${ticketDetailUpdateDTO.id}`, { statusId: ticketDetailUpdateDTO.statusId, adminComment: ticketDetailUpdateDTO.adminComment }, { headers });
  }

  getTicketStatuses(): Observable<TicketStatusDTO[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authTokenService.getToken()}`
    });

    return this.http.get<TicketStatusDTO[]>(`${this.apiUrl}/ticket-statuses`, { headers });
  }
}
