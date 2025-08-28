import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PATH_TO_ASSISTANCE } from '@app/app.routes';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(public navigationService: NavigationService) { }
}
