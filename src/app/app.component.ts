import { Component, inject } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { FooterComponent } from "./features/dashboard/components/footer/footer.component";
import { NavbarComponent } from "./features/navigation/components/navbar/navbar.component";
import { MatChipsModule } from '@angular/material/chips';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MatChipsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  dashboardMode = false;

  private router = inject(Router);

  constructor(public tokenService: AuthTokenService) { }

  ngOnInit(): void {

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {

        const url = event.urlAfterRedirects;

        // 👉 Toutes les pages du dashboard affichent la navbar
        const fullPageRoutes = [
          '/login',
          '/forgot-password',
          '/reset-password',
          '/assistance'
        ];

        // Si l’URL commence par l’une de ces routes → mode plein écran
        const isFullPage = fullPageRoutes.some(prefix => url.startsWith(prefix));

        this.dashboardMode = !isFullPage;
      });
  }
}