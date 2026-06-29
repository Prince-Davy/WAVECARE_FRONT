import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTimeoutOverlayComponent } from './idle-timeout-overlay.component';

describe('IdleTimeoutOverlayComponent', () => {
  let component: IdleTimeoutOverlayComponent;
  let fixture: ComponentFixture<IdleTimeoutOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleTimeoutOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdleTimeoutOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
