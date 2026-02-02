import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { environment } from '@environments/environment';
import { Page } from '../models/page';
import { UserViewDTO } from '../models/user-view-dto';
import { UserDetailDTO } from '../models/user-detail-dto';
import { UserDetailUpdateDTO } from '../models/user-detail-update';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    let authTokenService: jasmine.SpyObj<AuthTokenService>;
    const apiUrl = `${environment.apiUrl}/api/users`;
    const mockToken = 'test-token-123';

    beforeEach(() => {
        const authTokenServiceSpy = jasmine.createSpyObj('AuthTokenService', ['getToken']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                UserService,
                { provide: AuthTokenService, useValue: authTokenServiceSpy }
            ]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
        authTokenService = TestBed.inject(AuthTokenService) as jasmine.SpyObj<AuthTokenService>;
        authTokenService.getToken.and.returnValue(mockToken);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getUsers', () => {
        it('should fetch users with pagination and keywords', () => {
            const mockPage: Page<UserViewDTO> = {
                content: [{ id: "userId", firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'ADMIN', locked: false, creationDate: new Date() }],
                totalElements: 1,
                totalPages: 1,
                size: 10
            };
            const keywords = ['admin', 'active'];

            service.getUsers(0, 10, keywords).subscribe(result => {
                expect(result).toEqual(mockPage);
            });

            const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('page') === '0');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            expect(req.request.params.get('size')).toBe('10');
            expect(req.request.params.getAll('listKeywords')).toEqual(keywords);
            req.flush(mockPage);
        });

        it('should include sort parameters when provided', () => {
            service.getUsers(0, 10, [], 'firstName', 'ASC').subscribe();

            const req = httpMock.expectOne(req => req.url === apiUrl);
            expect(req.request.params.get('sort')).toBe('firstName,ASC');
            req.flush({});
        });

        it('should not include sort parameter when sortField is missing', () => {
            service.getUsers(0, 10, [], '', 'ASC').subscribe();

            const req = httpMock.expectOne(req => req.url === apiUrl);
            expect(req.request.params.has('sort')).toBeFalse();
            req.flush({});
        });
    });

    describe('getUser', () => {
        it('should fetch user details by ID', () => {
            const userId = 1;
            const mockUser: UserDetailDTO = {
                id: "userId",
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                locked: false,
                creationDate: new Date(),
                role: 'ADMIN'
            };

            service.getUser(userId).subscribe(result => {
                expect(result).toEqual(mockUser);
            });

            const req = httpMock.expectOne(`${apiUrl}/${userId}`);
            expect(req.request.method).toBe('GET');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockUser);
        });
    });

    describe('getUserRoles', () => {
        it('should fetch user roles', () => {
            const mockRoles = ['ADMIN', 'USER', 'MANAGER'];

            service.getUserRoles().subscribe(result => {
                expect(result).toEqual(mockRoles);
            });

            const req = httpMock.expectOne(`${apiUrl}/roles`);
            expect(req.request.method).toBe('GET');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockRoles);
        });
    });

    describe('updateUser', () => {
        it('should update user with provided details', () => {
            const userUpdate: UserDetailUpdateDTO = {
                id: "userId",
                firstName: 'Jane',
                lastName: 'Smith',
                role: 'MANAGER'
            };

            service.updateUser(userUpdate).subscribe();

            const req = httpMock.expectOne(`${apiUrl}/${userUpdate.id}`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            expect(req.request.body).toEqual({
                firstName: userUpdate.firstName,
                lastName: userUpdate.lastName,
                role: userUpdate.role
            });
            req.flush(null);
        });
    });

    describe('deleteUser', () => {
        it('should delete user by ID', () => {
            const userId = 'userId';

            service.deleteUser(userId).subscribe();

            const req = httpMock.expectOne(`${apiUrl}/${userId}`);
            expect(req.request.method).toBe('DELETE');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(null);
        });
    });


    describe('createUser', () => {

        it('should create a user with the provided payload', () => {

            const userCreate: UserDetailUpdateDTO = {
                firstName: 'New',
                lastName: 'User',
                email: 'new.user@example.com',
                role: 'USER'
            };



            service.createUser(userCreate).subscribe();
            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            expect(req.request.body).toEqual(userCreate);
            req.flush(null);
        });

    });

});

