import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PagePatientResponse, PatientResponse } from '@app/api/model';

export interface PatientFilters {
  keywords?: string[];
  birthDate?: string;
}

interface PatientLoadRequest {
  page: number;
  size: number;
  listKeywords: string[];
  sortField?: string;
  sortDirection?: string;
  filters?: PatientFilters;
}

const EMPTY_PAGE: PagePatientResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

@Injectable({ providedIn: 'root' })
export class PatientStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<PatientLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PagePatientResponse, PatientLoadRequest | undefined>({
    params: () => this._request(),
    stream: ({ params: req }) => {
      if (!req) return of(EMPTY_PAGE);

      const { page, size, listKeywords, sortField, sortDirection, filters } = req;
      const sort = sortField && sortDirection ? `${sortField},${sortDirection}` : undefined;
      const payloadFilters = { ...(filters ?? {}), keywords: listKeywords.length > 0 ? listKeywords : undefined };

      let params = new HttpParams()
        .set('page', page)
        .set('size', size);

      if (sort) {
        params = params.set('sort', sort);
      }
      params = params.set('filter', JSON.stringify(payloadFilters));

      return this.http.get<PagePatientResponse>('/api/v1/patients', { params });
    },
  });

  // --- public computed ---
  readonly patients = computed<PatientResponse[]>(() => this._resource.value()?.content ?? []);
  readonly totalElements = computed(() => this._resource.value()?.totalElements ?? 0);
  readonly pageSize = computed(() => this._resource.value()?.size ?? 10);
  readonly totalPages = computed(() => this._resource.value()?.totalPages ?? 0);
  readonly loading = this._resource.isLoading;
  readonly error = computed(() => {
    const err = this._resource.error();
    return err instanceof Error ? err.message : err ? String(err) : null;
  });

  load(
    page: number,
    size: number,
    listKeywords: string[],
    sortField?: string,
    sortDirection?: string,
    filters?: PatientFilters
  ): void {
    this._request.set({ page, size, listKeywords, sortField, sortDirection, filters });
  }
}
