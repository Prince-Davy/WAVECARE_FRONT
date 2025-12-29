
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserDialogComponent, UserDialogData } from './user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelect } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UserDetailDTO } from '../../models/user-detail-dto';
import { UserDetailUpdateDTO } from '../../models/user-detail-update';

describe('UserDialogComponent', () => {
  let fixture: ComponentFixture<UserDialogComponent>;
  let component: UserDialogComponent;

  // Données de base immuables (on fera des copies fraîches à chaque test)
  const rolesBase: string[] = ['ADMIN', 'USER', 'MANAGER'];

  const userBase: UserDetailDTO = {
    id: "10",
    lastName: 'Doe',
    firstName: 'John',
    email: 'john.doe@example.com',
    role: 'USER',
    locked: false,
    creationDate: new Date(),
  } as UserDetailDTO;

  const matDialogRefMock = {
    close: jasmine.createSpy('close'),
  } as unknown as MatDialogRef<UserDialogComponent>;

  beforeEach(async () => {
    const dialogData: UserDialogData = {
      userDetailDTO: { ...userBase },
      roles: [...rolesBase],
    };

    await TestBed.configureTestingModule({
      // Composant standalone : on l’importe directement
      imports: [
        UserDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        // Fournit TranslateService si le template utilise | translate
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: matDialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;

    // Optionnel : initialise i18n si des pipes | translate sont utilisés
    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');

    fixture.detectChanges();
  });

  afterEach(() => {
    (matDialogRefMock.close as jasmine.Spy).calls.reset();
    TestBed.resetTestingModule();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec les valeurs du user', () => {
    const fg = component.userDialogForm;
    expect(fg.get('lastName')?.value).toBe('Doe');
    expect(fg.get('firstName')?.value).toBe('John');
    expect(fg.get('email')?.value).toBe('john.doe@example.com');
    expect(fg.get('role')?.value).toBe('USER');
    // Le champ email est désactivé
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
    // ⚠️ Pour tester le validateur email, on doit activer le contrôle
    emailCtrl?.enable();
    emailCtrl?.setValue('not-an-email');
    expect(emailCtrl?.hasError('email')).toBeTrue();

    emailCtrl?.setValue('valid@test.com');
    expect(emailCtrl?.hasError('email')).toBeFalse();

    // rétablir l’état désactivé
    emailCtrl?.disable();
  });

  it('validate() devrait retourner un UserDetailUpdateDTO avec les valeurs choisies', () => {
    component.userDialogForm.get('lastName')?.setValue('Smith');
    component.userDialogForm.get('firstName')?.setValue('Alice');
    // email est readonly (disabled), donc on ne le modifie pas
    component.userDialogForm.get('role')?.setValue('ADMIN');

    const dto: UserDetailUpdateDTO = component.validate();

    expect(dto.id).toBe("10");
    expect(dto.lastName).toBe('Smith');
    expect(dto.firstName).toBe('Alice');
    expect(dto.role).toBe('ADMIN');
    // email ne doit pas être touché par validate(), ici on ne l’assert pas car ta méthode ne le modifie pas
  });

  it('validate() devrait mettre role="0" si le rôle est introuvable et laisser lastName/firstName vides si null', () => {
    component.userDialogForm.get('role')?.setValue('UNKNOWN');
    component.userDialogForm.get('lastName')?.setValue(null);
    component.userDialogForm.get('firstName')?.setValue(null);

    const dto = component.validate();

    expect(dto.role).toBe('0');        // rôle fallback
    expect(dto.lastName).toBe('');     // valeur par défaut si null
    expect(dto.firstName).toBe('');    // valeur par défaut si null
  });

  it('ngAfterViewInit devrait appeler focus() sur le MatSelect (via setTimeout)', fakeAsync(() => {
    const focusSpy = jasmine.createSpy('focus');
    // Mock du ViewChild MatSelect pour éviter la dépendance au template
    component.roleInput = { focus: focusSpy } as unknown as MatSelect;

    component.ngAfterViewInit();
    tick(0); // exécute le setTimeout(0)

    expect(focusSpy).toHaveBeenCalled();
  }));
});
