import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NotificationStackComponent } from './notification-stack.component';
import { NotificationService } from '../../services/notification.service';

describe('NotificationStackComponent', () => {
  let component: NotificationStackComponent;
  let fixture: ComponentFixture<NotificationStackComponent>;

  let notificationServiceMock: {
    notifications$: any;
    closeNotification: jasmine.Spy;
    getCloseLabel: jasmine.Spy;
  };

  beforeEach(async () => {
    notificationServiceMock = {
      notifications$: of([]),
      closeNotification: jasmine.createSpy('closeNotification'),
      getCloseLabel: jasmine
        .createSpy('getCloseLabel')
        .and.returnValue('Fermer'),
    };

    await TestBed.configureTestingModule({
      imports: [
        NotificationStackComponent,
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
      ],
    })
      .overrideComponent(NotificationStackComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose notifications stream from notification service', done => {
    component.notifications$.subscribe((notifications: unknown[]) => {
      expect(notifications).toEqual([]);
      done();
    });
  });

  it('should close notification by id', () => {
    component.closeNotification(10);

    expect(notificationServiceMock.closeNotification).toHaveBeenCalledOnceWith(10);
  });

  it('should return close label from notification service', () => {
    const label = component.getCloseLabel();

    expect(label).toBe('Fermer');
    expect(notificationServiceMock.getCloseLabel).toHaveBeenCalled();
  });
});