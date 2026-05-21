import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PagePatientResponse, PatientResponse } from '@app/api/model';

/**
 * PatientFilters
 * Filters that can be applied when loading patient lists.
 */
export interface PatientFilters {
  keywords?: string[];
  birthDate?: string;
}

/**
 * PatientLoadRequest
 * Internal request shape used by the patient store resource.
 */
interface PatientLoadRequest {
/**
 * TODO: Documentation for page (property)
 */
  page: number;
/**
 * TODO: Documentation for size (property)
 */
  size: number;
/**
 * TODO: Documentation for listKeywords (property)
 */
  listKeywords: string[];
  sortField?: string;
  sortDirection?: string;
  filters?: PatientFilters;
}

/**
 * EMPTY_PAGE
 * Default empty page used when there is no request or on errors.
 */
const EMPTY_PAGE: PagePatientResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

/**
 * PatientStore
 * Reactive store exposing patients list and pagination state.
 */
/**
 * TODO: Documentation for PatientStore (class)
 */
/**
 * TODO: Documentation for PatientStore (class)
 */
@Injectable({ providedIn: 'root' })
export class PatientStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<PatientLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PagePatientResponse, PatientLoadRequest | undefined>({
/**
 * TODO: Documentation for params (property)
 */
    params: () => this._request(),
/**
 * TODO: Documentation for stream (property)
 */
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

/**
 * TODO: Documentation for load (method)
 * @param page - TODO
 * @param size - TODO
 * @param listKeywords - TODO
 * @param sortField? - TODO
 * @param sortDirection? - TODO
 * @param filters? - TODO
 * @returns TODO
 */
  load(
/**
 * TODO: Documentation for page (property)
 */
    page: number,
/**
 * TODO: Documentation for size (property)
 */
    size: number,
/**
 * TODO: Documentation for listKeywords (property)
 */
    listKeywords: string[],
    sortField?: string,
    sortDirection?: string,
    filters?: PatientFilters
  ): void {
    this._request.set({ page, size, listKeywords, sortField, sortDirection, filters });
  }
}
