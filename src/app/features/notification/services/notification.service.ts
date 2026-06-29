import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error';

export interface AppNotification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly ACTION_MESSAGE_KEY = 'feature.notification.notification-service.action-message';

  private readonly SUCCESS_SNACK_BAR_DURATION = 5000;
  private readonly ERROR_SNACK_BAR_DURATION = 10000;

  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor(private translate: TranslateService) {}

  openErrorSnackBar(message: string, duration: number = this.ERROR_SNACK_BAR_DURATION): void {
    this.openNotification(message, 'error', duration);
  }

  openSuccessSnackBar(message: string, duration: number = this.SUCCESS_SNACK_BAR_DURATION): void {
    this.openNotification(message, 'success', duration);
  }

  closeNotification(id: number): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter(notification => notification.id !== id)
    );
  }

  getCloseLabel(): string {
    return this.translate.instant(this.ACTION_MESSAGE_KEY);
  }

  private openNotification(
    message: string,
    type: NotificationType,
    duration: number
  ): void {
    const notification: AppNotification = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      message,
      type,
      duration,
    };

    this.notificationsSubject.next([
      ...this.notificationsSubject.value,
      notification,
    ]);

    setTimeout(() => {
      this.closeNotification(notification.id);
    }, duration);
  }
}