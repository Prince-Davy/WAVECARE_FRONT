import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import type { UserResponse } from '@app/api/model';

export type TrashUserResponse = UserResponse & {
  deletedAt?: string;
};

export interface PageTrashUserResponse {
  content?: TrashUserResponse[];
  totalElements?: number;
  size?: number;
  number?: number;
}

export interface UserTrashListParams {
  page: number;
  size: number;
  sortField?: string;
  sortDirection?: string;
  keywords?: string[];
  roles?: string[];
  creationDate?: string;
}

export interface TrashActionItemResponse {
  id?: string | number | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  reason?: string | null;
  message?: string | null;
}

export interface TrashRestoreResponse {
  restored?: TrashActionItemResponse[];
  failed?: TrashActionItemResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class TrashService {
  private readonly http = inject(HttpClient);

  listInactiveUsers(params: UserTrashListParams): Observable<PageTrashUserResponse> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size);

    return this.http.get<PageTrashUserResponse>('/api/v1/users/trash', {
      params: httpParams,
    });
  }

  restoreUsers(ids: Array<string | number>): Observable<TrashRestoreResponse> {
    return this.http
      .patch<TrashRestoreResponse | null>('/api/v1/users/trash/restore', { ids })
      .pipe(
        map(response => response ?? { restored: [], failed: [] })
      );
  }

  permanentlyDeleteUsers(ids: Array<string | number>): Observable<void> {
    return this.http.request<void>('delete', '/api/v1/users/trash', {
      body: { ids },
    });
  }

  softDeleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`/api/v1/users/${id}`);
  }
}