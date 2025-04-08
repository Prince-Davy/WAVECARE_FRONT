import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from './features/auth/pages/auth/auth.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  template: `
    <app-auth></app-auth>
  `
})
export class AppComponent {
  title = 'WAVECARE_FRONT';
}
