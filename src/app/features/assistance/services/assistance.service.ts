import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@app/config.service';
import { CreateAssistanceTicketDTO } from '@app/features/assistance/models/assistance-ticket-dto';
import { TicketCategoryDTO } from '@app/features/assistance/models/assitance-ticket-category-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  
  constructor(private http: HttpClient) { }

  submitTicket(ticketData: CreateAssistanceTicketDTO): Observable<void> {
    return this.http.post<any>('api/tickets', ticketData);
  }

  getTicketCategories(): Observable<TicketCategoryDTO[]> {
    return this.http.get<TicketCategoryDTO[]>('api/ticket-categories');
  }
}
