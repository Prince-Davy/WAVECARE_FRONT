import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAssistanceTicketDTO } from '@app/core/auth/models/assistance-ticket-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  private apiUrl = 'http://localhost:8080/api/ticket';

  constructor(private http: HttpClient) { }

  submitTicket(ticketData: CreateAssistanceTicketDTO): Observable<void> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/create`, ticketData);
  }

  getTicketCategories(): Observable<string[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/get-categories`, { headers });
  }
}
