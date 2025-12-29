
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteUserDialogComponent, DeleteUserDialogData } from './delete-user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DeleteUserDialogComponent', () => {
  let fixture: ComponentFixture<DeleteUserDialogComponent>;
  let component: DeleteUserDialogComponent;

  // Mock MatDialogRef
  const matDialogRefMock = {
    close: jasmine.createSpy('close'),
  } as unknown as MatDialogRef<DeleteUserDialogComponent>;

  // Données injectées pour ce test
  const data: DeleteUserDialogData = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Composant standalone : on l’importe directement
      imports: [
        DeleteUserDialogComponent,
        // ✅ Initialise ngx-translate pour fournir TranslateService
        TranslateModule.forRoot(),
        // Optionnel mais utile avec Angular Material
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: matDialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialogComponent);
    component = fixture.componentInstance;

    // (Optionnel) Fixe une langue par défaut si le template utilise le pipe | translate
    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');

    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset des spies
    (matDialogRefMock.close as jasmine.Spy).calls.reset();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait injecter les données MAT_DIALOG_DATA', () => {
    expect(component.data).toEqual(data);
    expect(component.data.firstName).toBe('Jane');
    expect(component.data.lastName).toBe('Doe');
    expect(component.data.email).toBe('jane.doe@example.com');
  });

  it('onCancel() devrait fermer le dialog avec false', () => {
    component.onCancel();
    expect(matDialogRefMock.close).toHaveBeenCalledOnceWith(false);
  });

  it('onConfirm() devrait fermer le dialog avec true', () => {
    component.onConfirm();
    expect(matDialogRefMock.close).toHaveBeenCalledOnceWith(true);
  });
});
