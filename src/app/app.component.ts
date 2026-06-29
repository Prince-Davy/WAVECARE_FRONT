import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { AuthTokenService } from './features/auth/services/auth-token.service';
import { IdleTimeoutService } from './api/generated/idle-timeout/idle-timeout.service';

import { FooterComponent } from './features/dashboard/components/footer/footer.component';
import { NavbarComponent } from './features/navigation/components/navbar/navbar.component';
import { NotificationStackComponent } from './features/notification/components/notification-stack/notification-stack.component';
import { IdleTimeoutOverlayComponent } from './features/auth/components/idle-timeout-overlay/idle-timeout-overlay/idle-timeout-overlay.component';

import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MatChipsModule,
    NotificationStackComponent,
    IdleTimeoutOverlayComponent,
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly idleTimeoutService = inject(IdleTimeoutService);

  private readonly fullPageRoutes = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/assistance',
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    {
      initialValue: this.router.url,
    }
  );

  readonly dashboardMode = computed(() => {
    const url = this.currentUrl();

    return url
      ? !this.fullPageRoutes.some(prefix => url.startsWith(prefix))
      : false;
  });

  constructor(public tokenService: AuthTokenService) {
    effect(() => {
      const isAuthenticated = this.tokenService.isAuthenticated();
      const isDashboard = this.dashboardMode();

      if (isAuthenticated && isDashboard) {
        this.idleTimeoutService.startWatching();
      } else {
        this.idleTimeoutService.stopWatching();
      }
    });
  }
}