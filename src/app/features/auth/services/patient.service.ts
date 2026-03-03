import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService } from './auth-token.service';
import { PatientFilters, PatientDTO } from '@app/features/dashboard/components/patient-table/patient-table.component';
import { Observable } from 'rxjs';
import { Page } from '@app/features/dashboard/models/page';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly apiUrlPatients = `/api/patients`;

  constructor(private readonly http: HttpClient, private readonly authTokenService: AuthTokenService) {}

  getPatients(
    page: number,
    size: number,
    listKeywords: string[],
    sortField?: string,
    sortDirection?: string,
    filters?: PatientFilters
  ): Observable<Page<PatientDTO>> {

    const sort = sortField && sortDirection ? `${sortField},${sortDirection}` : null;

    const paramsObj: any = { page: String(page), size: String(size) };
    const payloadFilters: any = {...(filters ?? {}), keywords: listKeywords.length > 0 ? listKeywords : undefined};

    paramsObj['filter'] = JSON.stringify(payloadFilters);

    if (sort) paramsObj['sort'] = sort;

    const params = new HttpParams({ fromObject: paramsObj });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authTokenService.getToken()}`
    });

    return this.http.get<Page<PatientDTO>>(this.apiUrlPatients, { headers, params });
  }
}