import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserStore } from './user.store';
import { PagedUserDTO } from '@app/api/model';
import { UserFilters } from '../models/user-filters';

describe('UserStore', () => {
    let store: UserStore;
    let httpMock: HttpTestingController;
    const apiUrl = '/api/users';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserStore]
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
        it('should update signals on success', () => {
            const mockPage: PagedUserDTO = {
                content: [{ id: 'userId', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'ADMIN', locked: false }],
                totalElements: 1,
                totalPages: 1,
                size: 10
            };
            const filters: UserFilters = { keywords: ['Victor'] };

            store.load(0, 10, ['Victor'], undefined, undefined, filters);

            const req = httpMock.expectOne(r => r.url === apiUrl && r.params.get('page') === '0');
            expect(req.request.params.get('size')).toBe('10');

            const filterParam = req.request.params.get('filter');
            expect(filterParam).not.toBeNull();
            const parsedFilter = JSON.parse(filterParam!);
            expect(parsedFilter.keywords).toEqual(filters.keywords);

            req.flush(mockPage);

            expect(store.users()).toEqual(mockPage.content!);
            expect(store.totalElements()).toBe(1);
        });

        it('should include sort parameters when provided', () => {
            store.load(0, 10, [], 'firstName', 'ASC', {});

            const req = httpMock.expectOne(r => r.url === apiUrl);
            expect(req.request.params.get('sort')).toBe('firstName,ASC');
            req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 });
        });

        it('should not include sort parameter when sortField is missing', () => {
            store.load(0, 10, [], '', 'ASC', {});

            const req = httpMock.expectOne(r => r.url === apiUrl);
            expect(req.request.params.has('sort')).toBeFalse();
            req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10 });
        });
    });
});
