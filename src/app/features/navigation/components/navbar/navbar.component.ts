import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { PATH_TO_TICKETS } from '@app/app.routes';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  readonly PATH_TO_TICKETS_FOR_HTML = `/${PATH_TO_TICKETS}`;

  constructor(private authService: AuthService, public authTokenService: AuthTokenService, private navigationService: NavigationService) { }

  logout(): void {
    this.authService.logout();
    this.navigationService.navigateToLogin();
  }
}
