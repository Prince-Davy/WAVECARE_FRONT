import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent {
  // container : le contenu est injecté via le router-outlet
}
