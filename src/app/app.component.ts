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
/**
 * TODO: Documentation for AppComponent (class)
 */
/**
 * TODO: Documentation for AppComponent (class)
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

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
/**
 * TODO: Documentation for filter (method)
 * @param (e) - TODO
 * @returns TODO
 */
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
/**
 * TODO: Documentation for map (method)
 * @param e - TODO
 * @returns TODO
 */
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: '' }
  );

  readonly dashboardMode = computed(() => {
    const url = this.currentUrl();
    return url ? !this.fullPageRoutes.some(prefix => url.startsWith(prefix)) : false;
  });

/**
 * TODO: Documentation for constructor (method)
 * @param tokenService - TODO
 * @returns TODO
 */
  constructor(public tokenService: AuthTokenService) { }
}
