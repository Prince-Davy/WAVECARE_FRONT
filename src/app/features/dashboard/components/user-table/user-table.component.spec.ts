import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserTableComponent } from './user-table.component';
import { UserStore } from '@app/features/dashboard/stores/user.store';
import { UsersService } from '@app/api/generated/users/users.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import type { UserDTO } from '@app/api/model';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;

  const mockUsers: UserDTO[] = [
    {
      id: '0',
      firstName: 'Prénom 1',
      lastName: 'Nom 1',
      email: 'email1@email.com',
      role: 'USER' as any,
      locked: false,
    },
    {
      id: '1',
      firstName: 'Prénom 2',
      lastName: 'Nom 2',
      email: 'email2@email.com',
      role: 'USER' as any,
      locked: false,
    },
  ];

  const userStoreMock = {
    users: jasmine.createSpy('users').and.returnValue(mockUsers),
    totalElements: jasmine.createSpy('totalElements').and.returnValue(2),
    pageSize: jasmine.createSpy('pageSize').and.returnValue(10),
    loading: jasmine.createSpy('loading').and.returnValue(false),
    load: jasmine.createSpy('load'),
  };

  const usersServiceMock = jasmine.createSpyObj<UsersService>('UsersService', [
    'getUsers',
    'getRoles',
    'getUser',
    'deleteUser',
  ]);

  const notificationServiceMock = jasmine.createSpyObj<NotificationService>(
    'NotificationService',
    ['openErrorSnackBar', 'openSuccessSnackBar']
  );

  const authTokenServiceMock = jasmine.createSpyObj<AuthTokenService>(
    'AuthTokenService',
    ['getUserId']
  );

  const dialogMock = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    authTokenServiceMock.getUserId.and.returnValue('0');
    usersServiceMock.getRoles.and.returnValue(of(['USER', 'ADMINISTRATOR'] as any));
    usersServiceMock.getUser.and.returnValue(of({} as any));
    dialogMock.open.and.returnValue({
      afterClosed: () => of(false),
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        UserTableComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserStore, useValue: userStoreMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AuthTokenService, useValue: authTokenServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche les colonnes attendues', () => {
  expect(component.displayedColumns).toEqual([
    'lastName',
    'firstName',
    'email',
    'role',
    'locked',
    'creationDate',
    'update',
    'delete',
  ]);
});

  it('charge les utilisateurs depuis le store', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].firstName).toBe('Prénom 1');
    expect(component.dataSource.data[1].firstName).toBe('Prénom 2');
    expect(component.resultsLength).toBe(2);
    expect(component.pageSize).toBe(10);
    expect(component.isLoading).toBeFalse();
  });

  it('rappelle le store quand keywordsChanged est déclenché', fakeAsync(() => {
    userStoreMock.load.calls.reset();

    component.keywordsChanged(['abc']);
    tick();

    expect(component.listKeywords).toEqual(['abc']);
    expect(userStoreMock.load).toHaveBeenCalled();
  }));

  it('resetTable réinitialise les filtres', fakeAsync(() => {
    component.listKeywords = ['abc'];
    component.advancedFilters = {
      role: ['USER'],
      status: ['ACTIVE'],
      createdDate: '01/01/2026',
    } as any;
    userStoreMock.load.calls.reset();

    component.resetTable();
    tick();

    expect(component.listKeywords).toEqual([]);
    expect(component.advancedFilters).toEqual({});
    expect(component.filters).toEqual({
      keywords: [],
      roles: undefined,
      statuses: undefined,
      creationDate: undefined,
    });
    expect(userStoreMock.load).toHaveBeenCalled();
  }));

  it('retourne true si l’utilisateur est le current user', () => {
    expect(component.isCurrentUser({ id: '0' })).toBeTrue();
    expect(component.isCurrentUser({ id: '1' })).toBeFalse();
  });
});