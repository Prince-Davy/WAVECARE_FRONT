import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserTrashComponent } from './user-trash.component';
import { NotificationService } from '@app/features/notification/services/notification.service';

import {
  TrashService,
  TrashUserResponse,
} from '@app/api/generated/trash/trash.service';

describe('UserTrashComponent', () => {
  let component: UserTrashComponent;
  let fixture: ComponentFixture<UserTrashComponent>;

  let trashServiceMock: jasmine.SpyObj<TrashService>;
  let routerMock: jasmine.SpyObj<Router>;

  let notificationServiceMock: {
    openErrorSnackBar: jasmine.Spy;
    openSuccessSnackBar: jasmine.Spy;
  };

  const buildUser = (
    overrides: Partial<TrashUserResponse> = {}
  ): TrashUserResponse =>
    ({
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@test.fr',
      role: 'ADMIN',
      deletedAt: '2026-06-01T10:00:00Z',
      creationDate: '2026-01-01T10:00:00Z',
      ...overrides,
    }) as TrashUserResponse;

  const users: TrashUserResponse[] = [
    buildUser(),
    buildUser({
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@test.fr',
      role: 'PATIENT',
      deletedAt: '2026-06-02T10:00:00Z',
      creationDate: '2026-02-01T10:00:00Z',
    }),
  ];

  beforeEach(async () => {
    trashServiceMock = jasmine.createSpyObj<TrashService>('TrashService', [
      'listInactiveUsers',
      'restoreUsers',
      'permanentlyDeleteUsers',
    ]);

    trashServiceMock.listInactiveUsers.and.returnValue(
      of({
        content: [],
      } as any)
    );

    trashServiceMock.restoreUsers.and.returnValue(
      of({
        restored: [],
        failed: [],
      } as any)
    );

    trashServiceMock.permanentlyDeleteUsers.and.returnValue(of(undefined as any));

    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    notificationServiceMock = {
      openErrorSnackBar: jasmine.createSpy('openErrorSnackBar'),
      openSuccessSnackBar: jasmine.createSpy('openSuccessSnackBar'),
    };

    await TestBed.configureTestingModule({
      imports: [UserTrashComponent, NoopAnimationsModule],
      providers: [
        {
          provide: TrashService,
          useValue: trashServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    })
      .overrideComponent(UserTrashComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserTrashComponent);
    component = fixture.componentInstance;

    /**
     * Sécurité supplémentaire pour éviter que l’injection réelle reprenne la main.
     */
    (component as any).trashService = trashServiceMock;
    (component as any).notificationService = notificationServiceMock;
    (component as any).router = routerMock;

    fixture.detectChanges();

    trashServiceMock.restoreUsers.calls.reset();
    trashServiceMock.permanentlyDeleteUsers.calls.reset();
    notificationServiceMock.openErrorSnackBar.calls.reset();
    notificationServiceMock.openSuccessSnackBar.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to users page', () => {
    component.goBackToUsers();

    expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should delegate restoreUsers to trash service', () => {
    component.restoreUsers(['1', '2']);

    expect(trashServiceMock.restoreUsers).toHaveBeenCalledTimes(1);
    expect(trashServiceMock.restoreUsers).toHaveBeenCalledWith(['1', '2']);
  });

  it('should delegate permanentlyDeleteUsers to trash service', () => {
    component.permanentlyDeleteUsers(['1']);

    expect(trashServiceMock.permanentlyDeleteUsers).toHaveBeenCalledTimes(1);
    expect(trashServiceMock.permanentlyDeleteUsers).toHaveBeenCalledWith(['1']);
  });

  it('should toggle one row selection and update selected count', () => {
    component.dataSource.data = users;

    component.toggleRow(users[0]);

    expect(component.selection.isSelected(users[0])).toBeTrue();
    expect(component.selectedCount).toBe(1);
  });

  it('should select and unselect all rows on current page', () => {
    component.dataSource.data = users;

    component.masterToggle();

    expect(component.isAllSelected()).toBeTrue();
    expect(component.selectedCount).toBe(2);

    component.masterToggle();

    expect(component.isAllSelected()).toBeFalse();
    expect(component.selectedCount).toBe(0);
  });

  it('should return false when current page has no row selected', () => {
    component.dataSource.data = [];

    expect(component.isAllSelected()).toBeFalse();
  });

  it('should return checkbox label for master checkbox', () => {
    component.dataSource.data = users;

    expect(component.checkboxLabel()).toBe('Tout sélectionner');

    component.masterToggle();

    expect(component.checkboxLabel()).toBe('Tout désélectionner');
  });

  it('should return checkbox label for selected row', () => {
    component.dataSource.data = users;

    component.toggleRow(users[0]);

    expect(component.checkboxLabel(users[0])).toBe('Désélectionner Dupont Jean');
  });

  it('should return checkbox label for unselected row', () => {
    component.dataSource.data = users;

    expect(component.checkboxLabel(users[0])).toBe('Sélectionner Dupont Jean');
  });

  it('should apply keyword search locally', () => {
    component.allTrashUsers = users;

    component.keywordsChanged(['martin']);

    expect(component.listKeywords).toEqual(['martin']);
    expect(component.resultsLength).toBe(1);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe('2');
  });

  it('should apply keyword search with accents and case insensitive comparison', () => {
    component.allTrashUsers = [
      buildUser({
        id: '3',
        firstName: 'Élodie',
        lastName: 'Durand',
        email: 'elodie.durand@test.fr',
      }),
    ];

    component.keywordsChanged(['elodie']);

    expect(component.resultsLength).toBe(1);
    expect(component.dataSource.data[0].id).toBe('3');
  });

  it('should apply advanced filters locally', () => {
    component.allTrashUsers = users;

    component.advancedFiltersChanged({
      role: ['ADMIN'],
      createdDate: '2026-01-01',
    } as any);

    expect(component.resultsLength).toBe(1);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe('1');
  });

  it('should return no result when advanced filters do not match', () => {
    component.allTrashUsers = users;

    component.advancedFiltersChanged({
      role: ['MEDECIN'],
      createdDate: '2026-01-01',
    } as any);

    expect(component.resultsLength).toBe(0);
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should reset filters, keywords and selection', () => {
    component.allTrashUsers = users;
    component.dataSource.data = users;
    component.keywordsChanged(['martin']);
    component.toggleRow(users[1]);

    component.resetTable();

    expect(component.listKeywords).toEqual([]);
    expect(component.advancedFilters).toEqual({});
    expect(component.selectedCount).toBe(0);
    expect(component.resultsLength).toBe(2);
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should normalize strings', () => {
    expect((component as any).normalize(' ÉLÉONORE ')).toBe('eleonore');
    expect((component as any).normalize(null)).toBe('');
    expect((component as any).normalize(undefined)).toBe('');
  });

  it('should return sort values for known fields', () => {
    const user = buildUser();

    expect((component as any).getSortValue(user, 'lastName')).toBe('dupont');
    expect((component as any).getSortValue(user, 'firstName')).toBe('jean');
    expect((component as any).getSortValue(user, 'email')).toBe(
      'jean.dupont@test.fr'
    );
    expect((component as any).getSortValue(user, 'role')).toBe('admin');
    expect((component as any).getSortValue(user, 'status')).toBe('inactif');
    expect((component as any).getSortValue(user, 'unknown')).toBe('');
  });

  it('should return timestamp sort values for date fields', () => {
    const user = buildUser();

    expect((component as any).getSortValue(user, 'deletedAt')).toBe(
      new Date('2026-06-01T10:00:00Z').getTime()
    );

    expect((component as any).getSortValue(user, 'creationDate')).toBe(
      new Date('2026-01-01T10:00:00Z').getTime()
    );
  });

  it('should show error when restore is requested without selection', () => {
    component.openRestoreSelectedConfirmation();

    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledWith(
      'Veuillez sélectionner au moins un profil à restaurer.'
    );
    expect(component.isConfirmDialogOpen).toBeFalse();
  });

  it('should open local confirmation dialog for selected user restoration', () => {
    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();
    expect(component.confirmDialogTitle).toBe('Restaurer le profil');
    expect(component.confirmDialogMessage).toBe(
      'Voulez-vous restaurer le profil Jean Dupont (jean.dupont@test.fr) ?'
    );
    expect(component.confirmDialogConfirmLabel).toBe('Restaurer');
    expect(component.confirmDialogWarn).toBeFalse();
    expect((component as any).pendingAction).toBe('restore');
    expect((component as any).pendingUsers).toEqual([users[0]]);
    expect(trashServiceMock.restoreUsers).not.toHaveBeenCalled();
  });

  it('should open local confirmation dialog and restore selected user after confirmation', () => {
    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();
    component.confirmDialogAction();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.restoreUsers).toHaveBeenCalledTimes(1);
    expect(trashServiceMock.restoreUsers).toHaveBeenCalledWith(['1']);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledWith(
      'Le profil Jean Dupont (jean.dupont@test.fr) a été restauré.'
    );
  });

  it('should open local confirmation dialog and restore selected users after confirmation', () => {
    component.selection.select(...users);

    component.openRestoreSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();
    expect(component.confirmDialogTitle).toBe('Restaurer les profils');
    expect(component.confirmDialogMessage).toBe(
      'Voulez-vous restaurer les profils sélectionnés ?'
    );
    expect(component.confirmDialogConfirmLabel).toBe('Restaurer');
    expect(component.confirmDialogWarn).toBeFalse();

    component.confirmDialogAction();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.restoreUsers).toHaveBeenCalledWith(['1', '2']);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledWith(
      'Les profils sélectionnés ont été restaurés.'
    );
  });

  it('should not restore selected user when local confirmation dialog is cancelled', () => {
    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();

    component.cancelConfirmDialog();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.restoreUsers).not.toHaveBeenCalled();
    expect(notificationServiceMock.openSuccessSnackBar).not.toHaveBeenCalled();
    expect(notificationServiceMock.openErrorSnackBar).not.toHaveBeenCalled();
  });

  it('should show restore success message when backend returns restored users', () => {
    trashServiceMock.restoreUsers.and.returnValue(
      of({
        restored: [
          {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@test.fr',
          },
        ],
        failed: [],
      } as any)
    );

    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();
    component.confirmDialogAction();

    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledWith(
      '(Le profil Jean Dupont (jean.dupont@test.fr) a été restauré avec succès.'
    );
  });

  it('should show restore failure message when backend returns failed user with EMAIL_ALREADY_USED', () => {
    trashServiceMock.restoreUsers.and.returnValue(
      of({
        restored: [],
        failed: [
          {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@test.fr',
            reason: 'EMAIL_ALREADY_USED',
          },
        ],
      } as any)
    );

    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();
    component.confirmDialogAction();

    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledWith(
      jasmine.stringContaining(
        'cet email est déjà utilisé par un autre profil actif'
      )
    );
  });

  it('should build restore failure message for NOT_FOUND reason', () => {
    const message = (component as any).buildRestoreFailureMessage([
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.fr',
        reason: 'NOT_FOUND',
      },
    ]);

    expect(message).toContain('Jean Dupont');
    expect(message).toContain('ce profil n’existe plus dans la corbeille');
  });

  it('should build restore failure message for multiple failed users', () => {
    const message = (component as any).buildRestoreFailureMessage([
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.fr',
        reason: 'ALREADY_RESTORED',
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@test.fr',
        reason: 'CONCURRENT_UPDATE',
      },
      {
        id: '3',
        firstName: 'Paul',
        lastName: 'Durand',
        email: 'paul.durand@test.fr',
        reason: 'NOT_FOUND',
      },
      {
        id: '4',
        firstName: 'Luc',
        lastName: 'Bernard',
        email: 'luc.bernard@test.fr',
        reason: 'EMAIL_ALREADY_USED',
      },
    ]);

    expect(message).toContain("4 profils n'ont pas été restaurés");
    expect(message).toContain('+1 autre(s)');
  });

  it('should return custom failure reason message when reason is unknown', () => {
    const label = (component as any).getFailureReasonLabel({
      reason: 'UNKNOWN',
      message: 'message personnalisé',
    });

    expect(label).toBe('message personnalisé');
  });

  it('should show technical error when restore request fails', () => {
    spyOn(console, 'error');

    trashServiceMock.restoreUsers.and.returnValue(
      throwError(() => new Error('restore failed'))
    );

    component.selection.select(users[0]);

    component.openRestoreSelectedConfirmation();
    component.confirmDialogAction();

    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledWith(
      'Erreur technique lors de la restauration du profil Jean Dupont.'
    );
  });

  it('should show error when permanent delete is requested without selection', () => {
    component.openPermanentDeleteSelectedConfirmation();

    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledWith(
      'Veuillez sélectionner au moins un profil à supprimer définitivement.'
    );
    expect(component.isConfirmDialogOpen).toBeFalse();
  });

  it('should open local confirmation dialog for selected user permanent deletion', () => {
    component.selection.select(users[0]);

    component.openPermanentDeleteSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();
    expect(component.confirmDialogTitle).toBe('Suppression définitive du profil');
    expect(component.confirmDialogMessage).toBe(
      'Cette action est irréversible. Voulez-vous supprimer définitivement le profil Jean Dupont (jean.dupont@test.fr) ?'
    );
    expect(component.confirmDialogConfirmLabel).toBe(
      'Supprimer définitivement'
    );
    expect(component.confirmDialogWarn).toBeTrue();
    expect((component as any).pendingAction).toBe('delete');
    expect((component as any).pendingUsers).toEqual([users[0]]);
    expect(trashServiceMock.permanentlyDeleteUsers).not.toHaveBeenCalled();
  });

  it('should open local confirmation dialog and permanently delete selected user after confirmation', () => {
    component.selection.select(users[0]);

    component.openPermanentDeleteSelectedConfirmation();
    component.confirmDialogAction();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.permanentlyDeleteUsers).toHaveBeenCalledTimes(1);
    expect(trashServiceMock.permanentlyDeleteUsers).toHaveBeenCalledWith(['1']);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledWith(
      'Le profil Jean Dupont (jean.dupont@test.fr) a été supprimé définitivement.'
    );
  });

  it('should open local confirmation dialog and permanently delete selected users after confirmation', () => {
    component.selection.select(...users);

    component.openPermanentDeleteSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();
    expect(component.confirmDialogTitle).toBe('Suppression définitive');
    expect(component.confirmDialogMessage).toBe(
      'Cette action est irréversible. Voulez-vous supprimer définitivement les profils sélectionnés ?'
    );
    expect(component.confirmDialogConfirmLabel).toBe(
      'Supprimer définitivement'
    );
    expect(component.confirmDialogWarn).toBeTrue();

    component.confirmDialogAction();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.permanentlyDeleteUsers).toHaveBeenCalledWith([
      '1',
      '2',
    ]);
    expect(notificationServiceMock.openSuccessSnackBar).toHaveBeenCalledWith(
      'Les profils sélectionnés ont été supprimés définitivement.'
    );
  });

  it('should not permanently delete selected user when local confirmation dialog is cancelled', () => {
    component.selection.select(users[0]);

    component.openPermanentDeleteSelectedConfirmation();

    expect(component.isConfirmDialogOpen).toBeTrue();

    component.cancelConfirmDialog();

    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(trashServiceMock.permanentlyDeleteUsers).not.toHaveBeenCalled();
    expect(notificationServiceMock.openSuccessSnackBar).not.toHaveBeenCalled();
    expect(notificationServiceMock.openErrorSnackBar).not.toHaveBeenCalled();
  });

  it('should show error when permanent delete request fails', () => {
    spyOn(console, 'error');

    trashServiceMock.permanentlyDeleteUsers.and.returnValue(
      throwError(() => new Error('delete failed'))
    );

    component.selection.select(users[0]);

    component.openPermanentDeleteSelectedConfirmation();
    component.confirmDialogAction();

    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledTimes(1);
    expect(notificationServiceMock.openErrorSnackBar).toHaveBeenCalledWith(
      'Erreur lors de la suppression définitive du profil Jean Dupont (jean.dupont@test.fr).'
    );
  });
});

function expect<T>(actual: T): jasmine.Matchers<T> {
  return (globalThis as any).expect(actual);
}
