import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSearchBarComponent } from './ticket-search-bar.component';

describe('TicketSearchBarComponent', () => {
  let component: TicketSearchBarComponent;
  let fixture: ComponentFixture<TicketSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
