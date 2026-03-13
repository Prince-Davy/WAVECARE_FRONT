import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDialogComponent, UserDialogData } from './user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsersService } from '@app/api/generated/users/users.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { of } from 'rxjs';

import type { UserDTO } from '@app/api/model';

describe('UserDialogComponent', () => {
  let fixture: ComponentFixture<UserDialogComponent>;
  let component: UserDialogComponent;
  const rolesBase: string[] = ['ADMIN', 'USER', 'MANAGER'];
  const matDialogRefMock = {
    close: jasmine.createSpy('close'),
  } as unknown as MatDialogRef<UserDialogComponent>;
  const userServiceMock = {
    createUser: jasmine.createSpy('createUser').and.returnValue(of(void 0)),
    updateUser: jasmine.createSpy('updateUser').and.returnValue(of(void 0)),
  };
  const notificationServiceMock = {
    openSuccessSnackBar: jasmine.createSpy('openSuccessSnackBar')
  };

  afterEach(() => {
    (matDialogRefMock.close as jasmine.Spy).calls.reset();
    TestBed.resetTestingModule();
  });

  describe('En mode update', () => {
    const userBase: UserDTO = {
      id: "10",
      lastName: 'Doe',
      firstName: 'John',
      email: '***REMOVED***',
      role: 'USER',
      locked: false,
    } as UserDTO;

    beforeEach(async () => {
      const dialogData: UserDialogData = {
        user: { ...userBase },
        roles: [...rolesBase],
      };

      await TestBed.configureTestingModule({
        imports: [
          UserDialogComponent,
          ReactiveFormsModule,
          NoopAnimationsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: dialogData },
          { provide: MatDialogRef, useValue: matDialogRefMock },
          { provide: UsersService, useValue: userServiceMock },
          { provide: NotificationService, useValue: notificationServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UserDialogComponent);
      component = fixture.componentInstance;
      const translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('en');
      translate.use('en');
      fixture.detectChanges();
    });

    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait initialiser le formulaire avec les valeurs du user', () => {
      const fg = component.userDialogForm;
      expect(fg.get('lastName')?.value).toBe('Doe');
      expect(fg.get('firstName')?.value).toBe('John');
      expect(fg.get('email')?.value).toBe('***REMOVED***');
      expect(fg.get('role')?.value).toBe('USER');
      expect(fg.get('email')?.disabled).toBeTrue();
    });

    it('devrait valider que lastName/firstName/role sont requis', () => {
      const fg = component.userDialogForm;
      fg.get('lastName')?.setValue(null);
      expect(fg.get('lastName')?.hasError('required')).toBeTrue();
      fg.get('firstName')?.setValue(null);
      expect(fg.get('firstName')?.hasError('required')).toBeTrue();
      fg.get('role')?.setValue(null);
      expect(fg.get('role')?.hasError('required')).toBeTrue();
      expect(fg.valid).toBeFalse();
    });

    it('devrait appliquer la contrainte email sur le champ email (même désactivé)', () => {
      const emailCtrl = component.userDialogForm.get('email');
      emailCtrl?.enable();
      emailCtrl?.setValue('not-an-email');
      expect(emailCtrl?.hasError('email')).toBeTrue();
      emailCtrl?.setValue('valid@test.com');
      expect(emailCtrl?.hasError('email')).toBeFalse();
      emailCtrl?.disable();
    });

    it('validate() devrait retourner un UserDTO avec les valeurs choisies', () => {
      component.userDialogForm.get('lastName')?.setValue('Smith');
      component.userDialogForm.get('firstName')?.setValue('Alice');
      component.userDialogForm.get('role')?.setValue('ADMIN');
      const dto: UserDTO = component.validate();
      expect(dto.id).toBe("10");
      expect(dto.lastName).toBe('Smith');
      expect(dto.firstName).toBe('Alice');
      expect(dto.role).toBe('ADMIN');
    });

    it('validate() devrait mettre role="0" si le rôle est introuvable et laisser lastName/firstName vides si null', () => {
      component.userDialogForm.get('role')?.setValue('UNKNOWN');
      component.userDialogForm.get('lastName')?.setValue(null);
      component.userDialogForm.get('firstName')?.setValue(null);
      const dto = component.validate();
      expect(dto.role).toBe('0');
      expect(dto.lastName).toBe('');
      expect(dto.firstName).toBe('');
    });
  });

  describe('En mode création', () => {
    const userCreateBase: UserDTO = {
      id: undefined,
      lastName: '',
      firstName: '',
      email: '',
      role: 'USER',
      locked: false,
    } as unknown as UserDTO;

    beforeEach(async () => {
      const dialogData: UserDialogData = {
        user: { ...userCreateBase },
        roles: [...rolesBase],
        mode: 'create',
      };

      await TestBed.configureTestingModule({
        imports: [
          UserDialogComponent,
          ReactiveFormsModule,
          NoopAnimationsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: dialogData },
          { provide: MatDialogRef, useValue: matDialogRefMock },
          { provide: UsersService, useValue: userServiceMock },
          { provide: NotificationService, useValue: notificationServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UserDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('devrait initialiser un formulaire vide pour un nouvel user', () => {
      const fg = component.userDialogForm;
      expect(fg.get('lastName')?.value).toBe('');
      expect(fg.get('firstName')?.value).toBe('');
      expect(fg.get('email')?.value).toBe('');
      expect(fg.get('role')?.value).toBe('USER');
    });

    it('devrait avoir le champ email activé', () => {
      const emailCtrl = component.userDialogForm.get('email');
      expect(emailCtrl?.disabled).toBeFalse();
    });

    it('validate() devrait retourner un DTO avec email pour la création', () => {
      const fg = component.userDialogForm;
      fg.get('lastName')?.setValue('New');
      fg.get('firstName')?.setValue('User');
      fg.get('email')?.setValue('new@test.com');
      fg.get('role')?.setValue('MANAGER');
      const dto = component.validate();
      expect(dto.id).toBeNull();
      expect(dto.lastName).toBe('New');
      expect(dto.firstName).toBe('User');
      expect(dto.email).toBe('new@test.com');
      expect(dto.role).toBe('MANAGER');
    });
  });
});