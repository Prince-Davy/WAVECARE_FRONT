import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserStore } from './user.store';
import type { PagedUserDTO } from '@app/api/model';
import type { UserFilters } from '../models/user-filters';

describe('UserStore', () => {
  let store: UserStore;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserStore],
    });

    store = TestBed.inject(UserStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should start with empty state', () => {
    expect(store.users()).toEqual([]);
    expect(store.totalElements()).toBe(0);
    expect(store.loading()).toBeFalse();
  });

  describe('load', () => {
    it('should update signals on success', fakeAsync(() => {
      const mockPage: PagedUserDTO = {
        content: [
          {
            id: 'userId',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'ADMIN' as any,
            locked: false,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
      };

      const filters: UserFilters = { keywords: ['Victor'] };

      store.load(0, 10, ['Victor'], undefined, undefined, filters);

      store.users();
      TestBed.flushEffects();
      tick();

      const req = httpMock.expectOne((r) => r.url === apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');

      const filterParam = req.request.params.get('filter');
      expect(filterParam).not.toBeNull();
      expect(JSON.parse(filterParam!)).toEqual(filters);

      req.flush(mockPage);

      TestBed.flushEffects();
      tick();

      expect(store.users()).toEqual(mockPage.content!);
      expect(store.totalElements()).toBe(1);
    }));

    it('should include sort parameters when provided', fakeAsync(() => {
      store.load(0, 10, [], 'firstName', 'ASC', {});

      store.users();
      TestBed.flushEffects();
      tick();

      const req = httpMock.expectOne((r) => r.url === apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('sort')).toBe('firstName,ASC');
      expect(req.request.params.get('filter')).toBe('{}');

      req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 });

      TestBed.flushEffects();
      tick();
    }));

    it('should not include sort parameter when sortField is missing', fakeAsync(() => {
      store.load(0, 10, [], '', 'ASC', {});

      store.users();
      TestBed.flushEffects();
      tick();

      const req = httpMock.expectOne((r) => r.url === apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('sort')).toBeFalse();
      expect(req.request.params.get('filter')).toBe('{}');

      req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 });

      TestBed.flushEffects();
      tick();
    }));
  });
});