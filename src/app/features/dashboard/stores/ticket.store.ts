/**
 * Ticket Store Module
 * 
 * Manages ticket data state and API interactions using Angular signals and rxResource.
 * Provides reactive ticket list pagination, sorting, and filtering with keyword search.
 * 
 * @module TicketStore
 * @see {@link TicketStore} for the store class
 */
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PageTicketResponse, TicketResponse } from '@app/api/model';

/**
<<<<<<< Updated upstream
 * TicketLoadRequest
 * Internal request shape used by the ticket store resource.
=======
 * Ticket Load Request Interface
 * 
 * Internal request object for loading ticket data.
 * Contains pagination, sorting, and filter information.
 * 
 * @interface TicketLoadRequest
 * @property {number} page - Current page number (0-indexed)
 * @property {number} size - Number of items per page
 * @property {string[]} listKeywords - Keywords for ticket search
 * @property {Array} sortFields - Array of sort configurations with field and direction
 * @private
>>>>>>> Stashed changes
 */
interface TicketLoadRequest {
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
/**
 * TODO: Documentation for sortFields (property)
 */
  sortFields: { field: string; direction: 'asc' | 'desc' }[];
}

/**
<<<<<<< Updated upstream
 * EMPTY_PAGE
 * Default empty ticket page used when there is no request.
=======
 * Empty page constant
 * Default empty page response for initialization.
 * @constant
>>>>>>> Stashed changes
 */
const EMPTY_PAGE: PageTicketResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

/**
<<<<<<< Updated upstream
 * TicketStore
 * Reactive store exposing tickets list and pagination helpers.
 */
/**
 * TODO: Documentation for TicketStore (class)
 */
/**
 * TODO: Documentation for TicketStore (class)
=======
 * Ticket Store Service
 * 
 * Manages ticket data using Angular signals and reactive resource loading.
 * Handles pagination, sorting, filtering, with loading and error states.
 * 
 * @class TicketStore
 * @injectable
>>>>>>> Stashed changes
 */
@Injectable({ providedIn: 'root' })
export class TicketStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<TicketLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PageTicketResponse, TicketLoadRequest | undefined>({
/**
 * TODO: Documentation for params (property)
 */
    params: () => this._request(),
/**
 * TODO: Documentation for stream (property)
 */
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

  // --- public computed signals ---
  /**
   * Array of tickets from the current page
   */
  readonly tickets = computed<TicketResponse[]>(() => this._resource.value()?.content ?? []);
  
  /**
   * Total number of tickets across all pages
   */
  readonly totalElements = computed(() => this._resource.value()?.totalElements ?? 0);
  
  /**
   * Current page size (number of items per page)
   */
  readonly pageSize = computed(() => this._resource.value()?.size ?? 10);
  
  /**
   * Total number of pages
   */
  readonly totalPages = computed(() => this._resource.value()?.totalPages ?? 0);
  
  /**
   * Loading state signal - true when data is being fetched
   */
  readonly loading = this._resource.isLoading;
  
  /**
   * Error message from last failed request, or null if no error
   */
  readonly error = computed(() => {
    const err = this._resource.error();
    return err instanceof Error ? err.message : err ? String(err) : null;
  });

<<<<<<< Updated upstream
/**
 * TODO: Documentation for load (method)
 * @param page - TODO
 * @param size - TODO
 * @param listKeywords - TODO
 * @param sortFields - TODO
 * @returns TODO
 */
=======
  /**
   * Load ticket data with specified pagination, search, and sort parameters.
   * Triggers a new HTTP request to fetch ticket data.
   * 
   * @param {number} [page=0] - Page number (0-indexed)
   * @param {number} [size=10] - Number of items per page
   * @param {string[]} listKeywords - Keywords to search for in tickets
   * @param {Array} [sortFields=[]] - Sort fields with direction (asc/desc)
   */
>>>>>>> Stashed changes
  load(
    page = 0,
    size = 10,
/**
 * TODO: Documentation for listKeywords (property)
 */
    listKeywords: string[],
/**
 * TODO: Documentation for sortFields (property)
 */
    sortFields: { field: string; direction: 'asc' | 'desc' }[] = []
  ): void {
    this._request.set({ page, size, listKeywords, sortFields });
  }
}
