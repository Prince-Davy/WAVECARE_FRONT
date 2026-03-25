import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PageUserResponse, UserResponse } from '@app/api/model';
import { UserFilters } from '../models/user-filters';

interface UserLoadRequest {
  page: number;
  size: number;
  listKeywords: string[];
  sortField?: string;
  sortDirection?: string;
  filters?: UserFilters;
}

const EMPTY_PAGE: PageUserResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

@Injectable({ providedIn: 'root' })
export class UserStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<UserLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PageUserResponse, UserLoadRequest | undefined>({
    params: () => this._request(),
    stream: ({ params: req }) => {
      if (!req) return of(EMPTY_PAGE);

      const { page, size, listKeywords, sortField, sortDirection, filters } = req;
      const sort = sortField && sortDirection ? `${sortField},${sortDirection}` : undefined;

      let params = new HttpParams()
        .set('page', page)
        .set('size', size);

      if (sort) {
        params = params.set('sort', sort);
      }
      if (filters) {
        params = params.set('filter', JSON.stringify(filters));
      }

      return this.http.get<PageUserResponse>('/api/v1/users', { params });
    },
  });

  // --- public computed ---
  readonly users = computed<UserResponse[]>(() => this._resource.value()?.content ?? []);
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
    filters?: UserFilters
  ): void {
    this._request.set({ page, size, listKeywords, sortField, sortDirection, filters });
  }
}
