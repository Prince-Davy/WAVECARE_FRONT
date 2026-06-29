import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmUserDialogComponent } from './comfirm-user-dialog.component';

describe('ComfirmUserDialogComponent', () => {
  let component: ComfirmUserDialogComponent;
  let fixture: ComponentFixture<ComfirmUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComfirmUserDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComfirmUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
