import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AssistanceComponent } from '@app/features/assistance/components/assistance/assistance.component';
import { TicketsService } from '@app/api/generated/tickets/tickets.service';
import { TicketCategoriesService } from '@app/api/generated/ticket-categories/ticket-categories.service';

describe('AssistanceComponent', () => {
  let component: AssistanceComponent;
  let fixture: ComponentFixture<AssistanceComponent>;
  let ticketsServiceSpy: jasmine.SpyObj<TicketsService>;
  let ticketCategoriesServiceSpy: jasmine.SpyObj<TicketCategoriesService>;

  beforeEach(async () => {
    ticketsServiceSpy = jasmine.createSpyObj<TicketsService>('TicketsService', [
      'ticketCreate',
    ]);
    ticketCategoriesServiceSpy = jasmine.createSpyObj<TicketCategoriesService>(
      'TicketCategoriesService',
      ['ticketCategoryList']
    );

    ticketsServiceSpy.ticketCreate.and.returnValue(of({} as any));
    ticketCategoriesServiceSpy.ticketCategoryList.and.returnValue(
      of([{ id: 1, label: 'Identifiant' }] as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        AssistanceComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
        { provide: TicketsService, useValue: ticketsServiceSpy },
        { provide: TicketCategoriesService, useValue: ticketCategoriesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.assistanceForm.controls['lastName'].setValue('Doe');
    component.assistanceForm.controls['firstName'].setValue('John');
    component.assistanceForm.controls['mail'].setValue('john.doe@example.com');
    component.assistanceForm.controls['subject'].setValue(1);
    component.assistanceForm.controls['content'].setValue(
      'This is a valid test description.'
    );

    expect(component.assistanceForm.valid).toBeTrue();
  });

  it('should have an invalid form when fields are empty or incorrect', () => {
    component.assistanceForm.controls['lastName'].setValue('');
    component.assistanceForm.controls['firstName'].setValue('');
    component.assistanceForm.controls['mail'].setValue('invalid-email');
    component.assistanceForm.controls['subject'].setValue(null);
    component.assistanceForm.controls['content'].setValue('short');

    expect(component.assistanceForm.invalid).toBeTrue();
  });

  it('should set submissionSuccess to true on valid form submission', () => {
    component.assistanceForm.controls['lastName'].setValue('Doe');
    component.assistanceForm.controls['firstName'].setValue('John');
    component.assistanceForm.controls['mail'].setValue('john.doe@example.com');
    component.assistanceForm.controls['subject'].setValue(1);
    component.assistanceForm.controls['content'].setValue(
      'This is a valid test description.'
    );

    component.onSubmit();

    expect(ticketsServiceSpy.ticketCreate).toHaveBeenCalled();
    expect(component.submissionSuccess).toBeTrue();
  });

  it('should set submissionSuccess to false on invalid form submission', () => {
    component.assistanceForm.controls['lastName'].setValue('');
    component.assistanceForm.controls['firstName'].setValue('');
    component.assistanceForm.controls['mail'].setValue('invalid-email');
    component.assistanceForm.controls['subject'].setValue(null);
    component.assistanceForm.controls['content'].setValue('short');

    component.onSubmit();

    expect(ticketsServiceSpy.ticketCreate).not.toHaveBeenCalled();
    expect(component.submissionSuccess).toBeFalse();
  });
});