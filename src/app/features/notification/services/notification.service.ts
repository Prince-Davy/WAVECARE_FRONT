import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarClass } from '../models/snack-bar-class.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly ACTION_MESSAGE_KEY: string = 'feature.notification.notification-service.action-message';
  private readonly SNACK_BAR_DURATION: number = 5000;

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) { }

  openErrorSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.ERROR);
  }

  openSuccessSnackBar(message: string): void {
    this.openSnackBar(message, SnackBarClass.SUCCESS);
  }

  private openSnackBar(message: string, cssClass: SnackBarClass): void {
    this.snackBar.open(message, this.translate.instant(this.ACTION_MESSAGE_KEY), {
      panelClass: cssClass,
      verticalPosition: 'top',
      duration: this.SNACK_BAR_DURATION,
    } as MatSnackBarConfig);
  }
}
