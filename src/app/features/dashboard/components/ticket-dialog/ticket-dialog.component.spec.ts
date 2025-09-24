import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomTranslateLoader } from 'src/translate-loader';import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TicketDialogComponent, TicketDialogData } from './ticket-dialog.component';

describe('TicketDialogComponent', () => {
  let component: TicketDialogComponent;
  let fixture: ComponentFixture<TicketDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  let mockData: TicketDialogData;

  beforeEach(async () => {
    mockData = {
      ticketDetailDTO: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        mail: 'john.doe@example.com',
        categoryLabel: 'technical',
        description: 'Some issue',
        statusId: 1,
        adminComment: 'Initial comment'
      },
      statuses: [{ id: 0, label: 'STANDBY' }, { id: 1, label: 'PROCESS' }, { id: 2, label: 'SOLVED' }]
    };

    await TestBed.configureTestingModule({
      imports: [
        TicketDialogComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: CustomTranslateLoader
          }
        }),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.use('fr');

    fixture = TestBed.createComponent(TicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with ticket data', () => {
    expect(component.ticketDialogForm.value).toEqual({
      status: 'PROCESS',
      comment: 'Initial comment'
    });
  });

  it('should mark form as invalid if required fields are missing', () => {
    component.ticketDialogForm.setValue({ status: '', comment: '' });
    expect(component.ticketDialogForm.valid).toBeFalse();
  });

  it('should disable the confirm button if form is invalid', () => {
    component.ticketDialogForm.setValue({ status: '', comment: '' });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.ticket-dialog-validate')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable the confirm button if form is valid', () => {
    component.ticketDialogForm.setValue({ status: 'SOLVED', comment: 'Fixed it' });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.ticket-dialog-validate')).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should update ticket data on validate()', () => {
    component.ticketDialogForm.setValue({ status: 'SOLVED', comment: 'All good now' });
    const updatedTicket = component.validate();

    expect(updatedTicket.statusId).toBe(0);
    expect(updatedTicket.adminComment).toBe('All good now');
  });

  it('should handle null or empty ticket values gracefully', () => {
    component.data.ticketDetailDTO.statusId = null as any;
    component.data.ticketDetailDTO.adminComment = '';
    component.ticketDialogForm.setValue({ status: null, comment: '' });
    expect(component.ticketDialogForm.valid).toBeFalse();
  });

  it('should not update ticket if form is invalid in validate()', () => {
    component.ticketDialogForm.setValue({ status: '', comment: '' });
    const result = component.validate();
    expect(result.statusId).toBe(0);
    expect(result.adminComment).toBe('');
  });

  it('should render translated title with ticket id', () => {
    const title = fixture.debugElement.query(By.css('.ticket-dialog-title')).nativeElement;
    expect(title.textContent).toContain(mockData.ticketDetailDTO.id.toString());
  });
});
