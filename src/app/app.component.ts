// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { DashboardComponent } from './features/dashboard/abstract/dashboard-component.abstract';
import { FooterComponent } from "./features/dashboard/components/footer/footer.component";
import { NavbarComponent } from "./features/navigation/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WAVECARE_FRONT';

  dashboardMode: boolean = false;

  constructor(public tokenService: AuthTokenService) { }

  onActivate(component: any) {
    this.dashboardMode = (component instanceof DashboardComponent);
  }
}
