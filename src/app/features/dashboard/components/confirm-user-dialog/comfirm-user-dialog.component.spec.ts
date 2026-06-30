import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  ComfirmUserDialogComponent,
  ConfirmUsersActionDialogData,
} from './comfirm-user-dialog.component';

describe('ComfirmUserDialogComponent', () => {
  let component: ComfirmUserDialogComponent;
  let fixture: ComponentFixture<ComfirmUserDialogComponent>;

  const dialogData: ConfirmUsersActionDialogData = {
    title: 'Restaurer le compte',
    message: 'Voulez-vous restaurer le compte sélectionné ?',
    confirmLabel: 'Restaurer',
    cancelLabel: 'Annuler',
    confirmColor: 'primary',
    users: [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.fr',
      } as any,
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComfirmUserDialogComponent,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComfirmUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose injected dialog data', () => {
    expect(component.data).toEqual(dialogData);
  });

  it('should expose users from injected dialog data', () => {
    expect(component.data.users.length).toBe(1);
    expect(component.data.users[0].email).toBe('jean.dupont@test.fr');
  });
});