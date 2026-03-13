import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableHarness } from '@angular/material/table/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketTableComponent } from '@app/features/dashboard/components/ticket-table/ticket-table.component';
import { TicketStore } from '@app/features/dashboard/stores/ticket.store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import type { TicketViewDTO } from '@app/api/model';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) { return of({}); }
}

describe('TicketTableComponent', () => {
  let fixture: ComponentFixture<TicketTableComponent>;
  let component: TicketTableComponent;

  // writable signals for mock store
  let ticketsSignal: WritableSignal<TicketViewDTO[]>;
  let totalElementsSignal: WritableSignal<number>;
  let pageSizeSignal: WritableSignal<number>;
  let totalPagesSignal: WritableSignal<number>;
  let loadingSignal: WritableSignal<boolean>;
  let errorSignal: WritableSignal<string | null>;
  let loadSpy: jasmine.Spy;

  const mockTickets: TicketViewDTO[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      mail: 'jean.dupont@example.com',
      categoryLabel: 'ACCOUNT_ID',
      description: 'Test ticket',
      statusLabel: 'STANDBY',
    },
    {
      id: 2,
      firstName: 'Max',
      lastName: 'Dupont',
      mail: 'max.dupont@example.com',
      categoryLabel: 'OTHER',
      description: 'Another ticket',
      statusLabel: 'PROCESS',
    }
  ];

  beforeEach(async () => {
    ticketsSignal = signal<TicketViewDTO[]>([]);
    totalElementsSignal = signal(0);
    pageSizeSignal = signal(10);
    totalPagesSignal = signal(0);
    loadingSignal = signal(false);
    errorSignal = signal<string | null>(null);
    loadSpy = jasmine.createSpy('load');

    const mockStore = {
      tickets: ticketsSignal.asReadonly(),
      totalElements: totalElementsSignal.asReadonly(),
      pageSize: pageSizeSignal.asReadonly(),
      totalPages: totalPagesSignal.asReadonly(),
      loading: loadingSignal.asReadonly(),
      error: errorSignal.asReadonly(),
      load: loadSpy,
    };

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
      providers: [{ provide: TicketStore, useValue: mockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('displays the expected columns', () => {
    const expected = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'lastModifiedDate', 'action'];
    expect(component.displayedColumns).toEqual(expected);
  });

  it('calls store.load on init', () => {
    expect(loadSpy).toHaveBeenCalled();
  });

  it('loads and displays tickets in the table (MatTableHarness)', async () => {
    ticketsSignal.set(mockTickets);
    totalElementsSignal.set(2);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const table = await loader.getHarness(MatTableHarness);

    const text = await table.getCellTextByIndex();
    expect(text.length).toBe(2);
    expect(text[0].some(cell => cell.includes('Jean'))).toBeTrue();
    expect(text[1].some(cell => cell.includes('Max'))).toBeTrue();
  });

  it('clicks on the "edit" icon -> calls openTicketDialog(id)', () => {
    ticketsSignal.set([mockTickets[0]]);
    totalElementsSignal.set(1);
    fixture.detectChanges();

    spyOn(component, 'openTicketDialog');

    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon.material-symbols-outlined');
    expect(icon).toBeTruthy();

    icon.click();
    fixture.detectChanges();

    expect(component.openTicketDialog).toHaveBeenCalledOnceWith(1);
  });
});

});
