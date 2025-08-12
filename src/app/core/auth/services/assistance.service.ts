import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupportRequestDto } from '@app/core/auth/models/support-request.dto';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  private apiUrl = 'http://localhost:8080/api/support/submit';

  constructor(private http: HttpClient) { }

  submitTicket(ticketData: SupportRequestDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, ticketData, { headers })
      .pipe(
        catchError(this.handleError<any>('submitTicket'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
