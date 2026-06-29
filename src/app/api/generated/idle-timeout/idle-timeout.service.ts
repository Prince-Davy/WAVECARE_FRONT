import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subscription, fromEvent, interval, merge } from 'rxjs';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { Router } from '@angular/router';

export interface IdleTimeoutState {
  visible: boolean;
  remainingSeconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly warningDurationSeconds = 120;

  // Pour tester rapidement : 10_000.
  // En vrai : 13 * 60_000 pour prévenir après 13 min d’inactivité.
  private readonly idleBeforeWarningMs = 5_000;

  private idleTimerId?: ReturnType<typeof setTimeout>;
  private countdownSubscription?: Subscription;
  private activitySubscription?: Subscription;

  private remainingSeconds = this.warningDurationSeconds;
  private watching = false;

  readonly state$ = new BehaviorSubject<IdleTimeoutState>({
    visible: false,
    remainingSeconds: this.warningDurationSeconds,
  });

  startWatching(): void {
    if (this.watching) {
      return;
    }

    this.watching = true;

    this.activitySubscription = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'scroll')
    ).subscribe(() => {
      if (!this.state$.value.visible) {
        this.resetIdleTimer();
      }
    });

    this.resetIdleTimer();
  }

  stopWatching(): void {
    this.watching = false;

    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
      this.idleTimerId = undefined;
    }

    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = undefined;

    this.activitySubscription?.unsubscribe();
    this.activitySubscription = undefined;

    this.remainingSeconds = this.warningDurationSeconds;

    this.state$.next({
      visible: false,
      remainingSeconds: this.warningDurationSeconds,
    });
  }

  continueSession(): void {
    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = undefined;

    this.remainingSeconds = this.warningDurationSeconds;

    this.state$.next({
      visible: false,
      remainingSeconds: this.warningDurationSeconds,
    });

    this.resetIdleTimer();
  }

  logout(): void {
    this.stopWatching();

    this.authService.logout();

    this.router.navigateByUrl('/***REMOVED***', {
      replaceUrl: true,
    });
  }

  private resetIdleTimer(): void {
    if (!this.watching) {
      return;
    }

    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
    }

    this.idleTimerId = setTimeout(() => {
      this.showWarning();
    }, this.idleBeforeWarningMs);
  }

  private showWarning(): void {
    this.remainingSeconds = this.warningDurationSeconds;

    this.state$.next({
      visible: true,
      remainingSeconds: this.remainingSeconds,
    });

    this.countdownSubscription?.unsubscribe();

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.remainingSeconds--;

      this.state$.next({
        visible: true,
        remainingSeconds: this.remainingSeconds,
      });

      if (this.remainingSeconds <= 0) {
        this.logout();
      }
    });
  }
}