import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarClass } from '../models/snack-bar-class.enum';

/**
 * TODO: Documentation for NotificationService (class)
 */
/**
 * TODO: Documentation for NotificationService (class)
 */
/**
 * TODO: Documentation for NotificationService (class)
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly ACTION_MESSAGE_KEY = 'feature.notification.notification-service.action-message';
  private readonly SNACK_BAR_DURATION = 5000;

/**
 * TODO: Documentation for constructor (method)
 * @param snackBar - TODO
 * @param translate - TODO
 * @returns TODO
 */
  constructor(
/**
 * TODO: Documentation for snackBar (property)
 */
    private snackBar: MatSnackBar,
/**
 * TODO: Documentation for translate (property)
 */
    private translate: TranslateService
  ) {}

/**
 * TODO: Documentation for openErrorSnackBar (method)
 * @param message - TODO
 * @returns TODO
 */
  openErrorSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.ERROR);
  }

/**
 * TODO: Documentation for openSuccessSnackBar (method)
 * @param message - TODO
 * @returns TODO
 */
  openSuccessSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.SUCCESS);
  }

/**
 * TODO: Documentation for openSnackBar (method)
 * @param message - TODO
 * @param cssClass - TODO
 * @returns TODO
 */
  private openSnackBar(message: string, cssClass: SnackBarClass): void {
    this.snackBar.open(
      message,
      this.translate.instant(this.ACTION_MESSAGE_KEY),
      {
/**
 * TODO: Documentation for panelClass (property)
 */
        panelClass: [cssClass],
/**
 * TODO: Documentation for verticalPosition (property)
 */
        verticalPosition: 'top',
/**
 * TODO: Documentation for duration (property)
 */
        duration: this.SNACK_BAR_DURATION,
      }
    );
  }
}