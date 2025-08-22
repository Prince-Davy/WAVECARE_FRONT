import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketTableComponent } from '@app/features/dashboard/components/ticket-table/ticket-table.component';


describe('TicketTableComponent', () => {
  let component: TicketTableComponent;
  let fixture: ComponentFixture<TicketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TicketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
