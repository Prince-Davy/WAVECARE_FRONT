import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { TranslateModule } from '@ngx-translate/core';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [NotificationService],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
