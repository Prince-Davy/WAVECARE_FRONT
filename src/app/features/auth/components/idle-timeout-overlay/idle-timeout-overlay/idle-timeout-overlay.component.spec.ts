import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IdleTimeoutOverlayComponent } from './idle-timeout-overlay.component';
import { IdleTimeoutService } from '@app/api/generated/idle-timeout/idle-timeout.service';

describe('IdleTimeoutOverlayComponent', () => {
  let component: IdleTimeoutOverlayComponent;
  let fixture: ComponentFixture<IdleTimeoutOverlayComponent>;
  let idleTimeoutServiceSpy: jasmine.SpyObj<IdleTimeoutService>;

  beforeEach(async () => {
    idleTimeoutServiceSpy = jasmine.createSpyObj<IdleTimeoutService>('IdleTimeoutService', [
      'continueSession',
      'logout',
    ]);
    Object.defineProperty(idleTimeoutServiceSpy, 'state$', { value: of({}), writable: true });

    await TestBed.configureTestingModule({
      imports: [IdleTimeoutOverlayComponent],
      providers: [{ provide: IdleTimeoutService, useValue: idleTimeoutServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(IdleTimeoutOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate continuation and logout actions', () => {
    component.continueSession();
    component.logout();

    expect(idleTimeoutServiceSpy.continueSession).toHaveBeenCalled();
    expect(idleTimeoutServiceSpy.logout).toHaveBeenCalled();
  });

  it('should format remaining seconds as mm:ss', () => {
    expect(component.formatSeconds(0)).toBe('0:00');
    expect(component.formatSeconds(59)).toBe('0:59');
    expect(component.formatSeconds(125)).toBe('2:05');
  });
});
