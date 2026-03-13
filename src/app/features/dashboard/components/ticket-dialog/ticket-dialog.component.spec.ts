
// ticket-dialog.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { TicketDialogComponent, TicketDialogData } from './ticket-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TicketsService } from '@app/api/generated/tickets/tickets.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { of } from 'rxjs';

import { TicketDetailDTO, TicketStatusDTO } from '@app/api/model';

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
  const ticketServiceMock = {
    updateTicket: jasmine.createSpy('updateTicket').and.returnValue(of(void 0)),
  };
  const notificationServiceMock = {
    openSuccessSnackBar: jasmine.createSpy('openSuccessSnackBar')
  };

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
        { provide: TicketsService, useValue: ticketServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
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
});
