import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PageTicketResponse, TicketResponse } from '@app/api/model';

interface TicketLoadRequest {
  page: number;
  size: number;
  listKeywords: string[];
  sortFields: { field: string; direction: 'asc' | 'desc' }[];
}

const EMPTY_PAGE: PageTicketResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

@Injectable({ providedIn: 'root' })
export class TicketStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<TicketLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PageTicketResponse, TicketLoadRequest | undefined>({
    params: () => this._request(),
    stream: ({ params: req }) => {
      if (!req) return of(EMPTY_PAGE);

      const { page, size, listKeywords, sortFields } = req;

      let params = new HttpParams()
        .set('page', page)
        .set('size', size);

      listKeywords.forEach(keyword => {
        params = params.append('listKeywords', keyword);
      });

      sortFields.forEach(sort => {
        params = params.append('sort', `${sort.field},${sort.direction}`);
      });

      return this.http.get<PageTicketResponse>('/api/v1/tickets', { params });
    },
  });

  // --- public computed ---
  readonly tickets = computed<TicketResponse[]>(() => this._resource.value()?.content ?? []);
  readonly totalElements = computed(() => this._resource.value()?.totalElements ?? 0);
  readonly pageSize = computed(() => this._resource.value()?.size ?? 10);
  readonly totalPages = computed(() => this._resource.value()?.totalPages ?? 0);
  readonly loading = this._resource.isLoading;
  readonly error = computed(() => {
    const err = this._resource.error();
    return err instanceof Error ? err.message : err ? String(err) : null;
  });

  load(
    page = 0,
    size = 10,
    listKeywords: string[],
    sortFields: { field: string; direction: 'asc' | 'desc' }[] = []
  ): void {
    this._request.set({ page, size, listKeywords, sortFields });
  }
}
