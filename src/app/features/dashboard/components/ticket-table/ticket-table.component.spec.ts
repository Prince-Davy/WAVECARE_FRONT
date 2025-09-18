import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TicketTableComponent } from '@app/features/dashboard/components/ticket-table/ticket-table.component';
import { TicketService } from '@app/features/dashboard/services/ticket.service';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) { return of({}); }
}

describe('TicketTableComponent', () => {
  let fixture: ComponentFixture<TicketTableComponent>;
  let component: TicketTableComponent;
  let ticketServiceSpy: jasmine.SpyObj<TicketService>;

  const mockTickets = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      mail: 'jean.dupont@example.com',
      category: 'ACCOUNT_ID',
      description: 'Test ticket',
      status: 'STANDBY',
      creationDate: new Date('2025-03-15T10:20:00Z')
    },
    {
      id: 2,
      firstName: 'Max',
      lastName: 'Dupont',
      mail: 'max.dupont@example.com',
      category: 'OTHER',
      description: 'Another ticket',
      status: 'PROCESS',
      creationDate: new Date('2025-03-16T12:30:00Z')
    }
  ];

  beforeEach(async () => {
    ticketServiceSpy = jasmine.createSpyObj('TicketService', ['getTickets']);

    ticketServiceSpy.getTickets.and.returnValue(
      of({ content: [], totalElements: 0, totalPages: 0, size: 10 })
    );

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatIconModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        }),
        TicketTableComponent
      ],
      providers: [{ provide: TicketService, useValue: ticketServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('affiche les colonnes attendues', () => {
    const expected = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'date', 'action'];
    expect(component.displayedColumns).toEqual(expected);
  });

  it('charge et affiche les tickets dans la table (MatTableHarness)', async () => {
    ticketServiceSpy.getTickets.and.returnValue(
      of({ content: mockTickets, totalElements: 2, totalPages: 1, size: 10 })
    );

    component.ngAfterViewInit?.();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const table = await loader.getHarness(MatTableHarness);

    const text = await table.getCellTextByIndex();
    expect(text.length).toBe(2);
    expect(text[0].some(cell => cell.includes('Jean'))).toBeTrue();
    expect(text[1].some(cell => cell.includes('Max'))).toBeTrue();
  });

  it('pagine avec MatPaginatorHarness et rappelle le service', fakeAsync(async () => {
    ticketServiceSpy.getTickets.and.returnValues(
      of({ content: mockTickets, totalElements: 20, totalPages: 10, size: 2 }), // page 0
      of({ content: mockTickets, totalElements: 20, totalPages: 10, size: 2 }) // page 1
    );

    component.pageSize = 2;
    component.pageSizeOptions = [2, 5, 10];
    component.ngAfterViewInit?.();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const paginator = await loader.getHarness(MatPaginatorHarness);

    expect(await paginator.getPageSize()).toBe(2);
    expect(await paginator.getRangeLabel()).toContain('1');    await paginator.goToNextPage();
    fixture.detectChanges();
    tick(); 

    expect(ticketServiceSpy.getTickets.calls.count()).toBeGreaterThanOrEqual(2);
  }));

  it('clique sur l’icône "edit" -> appelle openTicketDialog(id)', () => {
    ticketServiceSpy.getTickets.and.returnValue(
      of({ content: [mockTickets[0]], totalElements: 1, totalPages: 1, size: 10 })
    );
    component.ngAfterViewInit?.();
    fixture.detectChanges();

    spyOn(component, 'openTicketDialog');

    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon.material-symbols-outlined');
    expect(icon).toBeTruthy();

    icon.click();
    fixture.detectChanges();

    expect(component.openTicketDialog).toHaveBeenCalledOnceWith(1);
  });

  it('keypress Enter/Space sur l’icône -> appelle openTicketDialog(id)', () => {
    ticketServiceSpy.getTickets.and.returnValue(
      of({ content: [mockTickets[0]], totalElements: 1, totalPages: 1, size: 10 })
    );
    component.ngAfterViewInit?.();
    fixture.detectChanges();

    spyOn(component, 'openTicketDialog');

    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon.material-symbols-outlined')!;
    const enter = new KeyboardEvent('keypress', { key: 'Enter' });
    const space = new KeyboardEvent('keypress', { key: ' ' });

    icon.dispatchEvent(enter);
    fixture.detectChanges();
    icon.dispatchEvent(space);
    fixture.detectChanges();

    expect(component.openTicketDialog).toHaveBeenCalled();
    const args = (component.openTicketDialog as jasmine.Spy).calls.mostRecent().args;
    expect(args[0]).toBe(1);
  });

});