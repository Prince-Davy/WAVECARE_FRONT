import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { FooterComponent } from "./features/dashboard/components/footer/footer.component";
import { NavbarComponent } from "./features/navigation/components/navbar/navbar.component";
import { MatChipsModule } from '@angular/material/chips';
import { filter, map } from 'rxjs/operators';

/**
 * AppComponent
 * Root application shell that controls layout and route-aware UI modes.
 * Exposes `dashboardMode` signal to hide chrome on specific full-page routes.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MatChipsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly router = inject(Router);

  private readonly fullPageRoutes = ['/login', '/forgot-password', '/reset-password', '/assistance'];

  /**
   * Observable that emits the current URL after each navigation event.
   * Used to determine if the dashboard layout should be visible.
   */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: '' }
  );

  /**
   * Computed signal indicating whether the dashboard layout should be displayed.
   * Returns true when the current URL is not in fullPageRoutes.
   */
  readonly dashboardMode = computed(() => {
    const url = this.currentUrl();
    return url ? !this.fullPageRoutes.some(prefix => url.startsWith(prefix)) : false;
  });

/**
 * AppComponent constructor.
 * Injects the AuthTokenService for authentication token management.
 * 
 * @param tokenService - Authentication token service
 */
  constructor(public tokenService: AuthTokenService) { }
}
