<<<<<<< Updated upstream
﻿import { Component, computed, effect, inject } from '@angular/core';
=======
﻿/**
 * Application Root Component Module
 * 
 * The main application component that handles layout, routing, and global navigation.
 * Manages navbar, footer, and router outlet.
 * 
 * @module AppComponent
 * @see {@link AppComponent} for the component class
 */
import { Component, computed, inject } from '@angular/core';
>>>>>>> Stashed changes
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

<<<<<<< Updated upstream
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { IdleTimeoutService } from './api/generated/idle-timeout/idle-timeout.service';

import { FooterComponent } from './features/dashboard/components/footer/footer.component';
import { NavbarComponent } from './features/navigation/components/navbar/navbar.component';
import { NotificationStackComponent } from './features/notification/components/notification-stack/notification-stack.component';
import { IdleTimeoutOverlayComponent } from './features/auth/components/idle-timeout-overlay/idle-timeout-overlay/idle-timeout-overlay.component';

import { MatChipsModule } from '@angular/material/chips';

=======
/**
 * Application Root Component
 * 
 * Main application component that:
 * - Manages the overall layout (navbar, footer, content)
 * - Handles route navigation and layout switching
 * - Switches between full-page layout (***REMOVED***, assistance) and dashboard layout
 * - Provides global styling and structure
 * 
 * Full-page routes (without navbar/footer): /***REMOVED***, /***REMOVED***, /***REMOVED***, /assistance
 * Dashboard routes: All other routes display with navbar and footer
 * 
 * @class AppComponent
 * @standalone
 */
>>>>>>> Stashed changes
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
    '/***REMOVED***',
    '/***REMOVED***',
    '/***REMOVED***',
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
    if (url === undefined || url === null || url === '' || url === '/') {
      return true;
    }
    return !this.fullPageRoutes.some(prefix => url.startsWith(prefix));
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