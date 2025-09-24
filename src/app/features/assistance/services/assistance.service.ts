import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAssistanceTicketDTO } from '@app/features/assistance/models/assistance-ticket-dto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketCategoryDTO } from '@app/features/assistance/models/assitance-ticket-category-dto';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  submitTicket(ticketData: CreateAssistanceTicketDTO): Observable<void> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, ticketData);
  }

  getTicketCategories(): Observable<TicketCategoryDTO[]> {
    return this.http.get<TicketCategoryDTO[]>(`${this.apiUrl}/categories`);
  }
}
