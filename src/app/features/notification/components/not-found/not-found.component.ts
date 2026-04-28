import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PATH_TO_ASSISTANCE } from '@app/app.routes';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * NotFoundComponent
 * Simple 404 view that offers assistance navigation to users.
 */
/**
 * TODO: Documentation for NotFoundComponent (class)
 */
/**
 * TODO: Documentation for NotFoundComponent (class)
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatButton,
    MatIconModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  readonly PATH_TO_ASSISTANCE_FOR_HTML = `/${PATH_TO_ASSISTANCE}`;

/**
 * TODO: Documentation for constructor (method)
 * @param navigationService - TODO
 * @returns TODO
 */
  constructor(public navigationService: NavigationService) { }
}
