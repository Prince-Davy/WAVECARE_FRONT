import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-stack',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './notification-stack.component.html',
  styleUrl: './notification-stack.component.scss',
})
export class NotificationStackComponent {
  readonly notificationService = inject(NotificationService);
  readonly notifications$ = this.notificationService.notifications$;

  closeNotification(id: number): void {
    this.notificationService.closeNotification(id);
  }

  getCloseLabel(): string {
    return this.notificationService.getCloseLabel();
  }
}