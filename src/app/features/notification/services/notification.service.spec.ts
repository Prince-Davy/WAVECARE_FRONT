import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        NotificationService,
        { provide: TranslateService, useValue: translate },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an error notification and close it after custom duration', fakeAsync(() => {
    let notifications: any[] = [];
    service.notifications$.subscribe((value) => {
      notifications = value;
    });

    service.openErrorSnackBar('Erreur technique', 250);

    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toBe('Erreur technique');
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].duration).toBe(250);

    tick(250);
    expect(service['notificationsSubject'].value).toEqual([]);
  }));

  it('should create a success notification with default duration and translate close label', fakeAsync(() => {
    service.openSuccessSnackBar('Sauvegardé');

    const notifications = service['notificationsSubject'].value;
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].duration).toBe(5000);
    expect(service.getCloseLabel()).toBe('feature.notification.notification-service.action-message');

    tick(5000);
    expect(service['notificationsSubject'].value).toEqual([]);
  }));

  it('should close a specific notification by id', () => {
    service.openSuccessSnackBar('Premier');
    service.openSuccessSnackBar('Deuxième');

    const [first] = service['notificationsSubject'].value;
    service.closeNotification(first.id);

    expect(service['notificationsSubject'].value.length).toBe(1);
    expect(service['notificationsSubject'].value[0].message).toBe('Deuxième');
  });
});
