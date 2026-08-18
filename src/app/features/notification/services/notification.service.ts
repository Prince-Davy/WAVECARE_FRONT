/**
 * Notification Service Module
 * 
 * Provides notification and snackbar functionality for user feedback.
 * Handles success, error, and informational messages throughout the application.
 * 
 * @module NotificationService
 * @see {@link NotificationService} for the service class
 */
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

/**
 * Notification Service
 * 
 * Manages user notifications through material snackbars.
 * Provides methods for displaying success, error, and informational messages.
 * All messages are i18n translated.
 * 
 * @class NotificationService
 * @injectable
 * @see {@link MatSnackBar} for Angular Material snackbar
 * @see {@link TranslateService} for i18n translation
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly ACTION_MESSAGE_KEY = 'feature.notification.notification-service.action-message';

<<<<<<< Updated upstream
  private readonly SUCCESS_SNACK_BAR_DURATION = 5000;
  private readonly ERROR_SNACK_BAR_DURATION = 70000;

  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor(private translate: TranslateService) {}

  openErrorSnackBar(message: string, duration: number = this.ERROR_SNACK_BAR_DURATION): void {
    this.openNotification(message, 'error', duration);
  }

  openSuccessSnackBar(message: string, duration: number = this.SUCCESS_SNACK_BAR_DURATION): void {
    this.openNotification(message, 'success', duration);
=======
  /**
   * i18n key for the snackbar action message (e.g., "Close")
   * @private
   * @type {string}
   */
  private readonly ACTION_MESSAGE_KEY: string = 'feature.notification.notification-service.action-message';
  
  /**
   * Duration to display snackbar notifications (in milliseconds)
   * @private
   * @type {number}
   */
  private readonly SNACK_BAR_DURATION: number = 5000;

  /**
   * Constructor
   * 
   * @constructor
   * @param {MatSnackBar} snackBar - Material snackbar service
   * @param {TranslateService} translate - i18n translation service
   */
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) { }

  /**
   * Display an error notification
   * 
   * Shows a red snackbar with the provided error message.
   * 
   * @method openErrorSnackBar
   * @param {string} message - The error message to display
   * @returns {void}
   * @example
   * this.notificationService.openErrorSnackBar('An error occurred');
   */
  openErrorSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.ERROR);
  }

  /**
   * Display a success notification
   * 
   * Shows a green snackbar with the provided success message.
   * 
   * @method openSuccessSnackBar
   * @param {string} message - The success message to display
   * @returns {void}
   * @example
   * this.notificationService.openSuccessSnackBar('Operation completed successfully');
   */
  openSuccessSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.SUCCESS);
>>>>>>> Stashed changes
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