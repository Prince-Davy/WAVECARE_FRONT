import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { IdleTimeoutService } from '@app/api/generated/idle-timeout/idle-timeout.service';

@Component({
  selector: 'app-idle-timeout-overlay',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './idle-timeout-overlay.component.html',
  styleUrl: './idle-timeout-overlay.component.scss',
})
export class IdleTimeoutOverlayComponent {
  readonly idleTimeoutService = inject(IdleTimeoutService);
  readonly state$ = this.idleTimeoutService.state$;

  continueSession(): void {
    this.idleTimeoutService.continueSession();
  }

  logout(): void {
    this.idleTimeoutService.logout();
  }

  formatSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}