import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { PatientFilters, PatientDTO } from '@app/features/dashboard/components/patients/patient-table/patient-table.component';
import { Observable } from 'rxjs';
import { Page } from '@app/features/dashboard/models/page';
import { PatientDetailDto } from '@app/features/dashboard/models/patient-detail.dto';



@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly apiUrl = '/api/patients';

  constructor(private readonly http: HttpClient, private authTokenService: AuthTokenService) {}

  getPatientDetail(id: string): Observable<PatientDetailDto> {
    const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.token()}`
		});

    return this.http.get<PatientDetailDto>(`${this.apiUrl}/${id}`, { headers });
  }
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
      Authorization: `Bearer ${this.authTokenService.token()}`
    });

    return this.http.get<Page<PatientDTO>>(this.apiUrl, { headers, params });
  }
}
