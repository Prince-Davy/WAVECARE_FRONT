import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAssistanceTicketDTO } from '@app/features/assistance/models/assistance-ticket-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) { }

  submitTicket(ticketData: CreateAssistanceTicketDTO): Observable<void> {
    return this.http.post<any>(`${this.apiUrl}/create`, ticketData);
  }

  getTicketCategories(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/get-categories`);
  }
}
