
// ticket-dialog.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { TicketDialogComponent, TicketDialogData } from './ticket-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

import { TicketDetailDTO } from '../../models/ticket-detail-dto';
import { TicketStatusDTO } from '../../models/ticket-status-dto';

describe('TicketDialogComponent', () => {
  let fixture: ComponentFixture<TicketDialogComponent>;
  let component: TicketDialogComponent;

  const statuses: TicketStatusDTO[] = [
    { id: 1, label: 'Ouvert' } as TicketStatusDTO,
    { id: 2, label: 'Fermé' } as TicketStatusDTO,
  ];

  const ticket: TicketDetailDTO = {
    id: 42,
    statusId: 1,
    adminComment: 'Commentaire initial',
    // Ajoutez ici les champs requis par votre interface si nécessaire
  } as TicketDetailDTO;

  const dialogData: TicketDialogData = {
    ticketDetailDTO: { ...ticket },
    statuses,
  };

  const matDialogRefMock = {
    close: jasmine.createSpy('close'),
  } as unknown as MatDialogRef<TicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Le composant est standalone : on l’importe directement
        TicketDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: matDialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDialogComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec les valeurs du ticket', () => {
    fixture.detectChanges();
    const fg = component.ticketDialogForm;
    expect(fg.get('status')?.value).toBe(1);
    expect(fg.get('comment')?.value).toBe('Commentaire initial');
  });

  it('devrait valider que "status" est requis', () => {
    fixture.detectChanges();
    const statusCtrl = component.ticketDialogForm.get('status');
    statusCtrl?.setValue(null);
    expect(statusCtrl?.hasError('required')).toBeTrue();
    expect(component.ticketDialogForm.valid).toBeFalse();
  });

  it('devrait appliquer la contrainte maxlength(500) sur "comment"', () => {
    fixture.detectChanges();
    const longText = 'x'.repeat(501);
    const commentCtrl = component.ticketDialogForm.get('comment');
    commentCtrl?.setValue(longText);
    expect(commentCtrl?.hasError('maxlength')).toBeTrue();
  });

  it('validate() devrait retourner un TicketDetailUpdateDTO avec les valeurs choisies', () => {
    fixture.detectChanges();
    component.ticketDialogForm.setValue({ status: 2, comment: 'Mise à jour' });

    const dto = component.validate();
    expect(dto.id).toBe(42);
    expect(dto.statusId).toBe(2);
    expect(dto.adminComment).toBe('Mise à jour');
  });

  it('validate() devrait mettre statusId=0 si le statut est introuvable et adminComment="" si absent', () => {
    fixture.detectChanges();
    component.ticketDialogForm.setValue({ status: 999, comment: null });

    const dto = component.validate();
    expect(dto.statusId).toBe(0);
    expect(dto.adminComment).toBe('');
  });

  it('ngAfterViewInit devrait appeler le focus sur le MatSelect (via setTimeout)', fakeAsync(() => {
    // On mocke le ViewChild pour éviter de dépendre du template
    const focusSpy = jasmine.createSpy('focus');
    component.statusInput = { focus: focusSpy } as unknown as MatSelect;

    // Appel manuel de ngAfterViewInit
    component.ngAfterViewInit();

    // setTimeout(0) => tick(0)
    tick(0);
    expect(focusSpy).toHaveBeenCalled();
  }));
});
