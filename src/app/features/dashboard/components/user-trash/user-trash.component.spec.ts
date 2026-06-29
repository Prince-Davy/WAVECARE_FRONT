import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrashComponent } from './user-trash.component';

describe('UserTrashComponent', () => {
  let component: UserTrashComponent;
  let fixture: ComponentFixture<UserTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
