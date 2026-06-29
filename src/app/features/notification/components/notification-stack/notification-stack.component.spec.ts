import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationStackComponent } from './notification-stack.component';

describe('NotificationStackComponent', () => {
  let component: NotificationStackComponent;
  let fixture: ComponentFixture<NotificationStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
