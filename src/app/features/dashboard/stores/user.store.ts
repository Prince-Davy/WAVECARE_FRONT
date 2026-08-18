/**
 * User Store Module
 * 
 * Manages user data state and API interactions using Angular signals and rxResource.
 * Provides reactive user list pagination, sorting, and filtering.
 * 
 * @module UserStore
 * @see {@link UserStore} for the store class
 */
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { PageUserResponse, UserResponse } from '@app/api/model';
import { UserFilters } from '../models/user-filters';

/**
<<<<<<< Updated upstream
 * UserLoadRequest
 * Internal request shape used by the user store resource.
=======
 * User Load Request Interface
 * 
 * Internal request object for loading user data.
 * Contains pagination, sorting, and filter information.
 * 
 * @interface UserLoadRequest
 * @private
>>>>>>> Stashed changes
 */
interface UserLoadRequest {
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
  filters?: UserFilters;
}

/**
<<<<<<< Updated upstream
 * EMPTY_PAGE
 * Default empty user page used when there is no request.
=======
 * Empty page constant
 * 
 * Default empty page response for initialization.
 * 
 * @constant
>>>>>>> Stashed changes
 */
const EMPTY_PAGE: PageUserResponse = { content: [], totalElements: 0, totalPages: 0, size: 10 };

/**
<<<<<<< Updated upstream
 * UserStore
 * Reactive store exposing users list and pagination helpers.
 */
/**
 * TODO: Documentation for UserStore (class)
 */
/**
 * TODO: Documentation for UserStore (class)
=======
 * User Store Service
 * 
 * Manages user data using Angular signals and reactive resource loading.
 * Handles:
 * - User list pagination
 * - Sorting
 * - Search and filtering
 * - Cache management
 * 
 * @class UserStore
 * @injectable
>>>>>>> Stashed changes
 */
@Injectable({ providedIn: 'root' })
export class UserStore {

  private readonly http = inject(HttpClient);

  private readonly _request = signal<UserLoadRequest | undefined>(undefined);

  private readonly _resource = rxResource<PageUserResponse, UserLoadRequest | undefined>({
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
    filters?: UserFilters
  ): void {
    this._request.set({ page, size, listKeywords, sortField, sortDirection, filters });
  }
}
