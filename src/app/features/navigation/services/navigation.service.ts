import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_TO_ASSISTANCE, PATH_TO_TICKETS } from '@app/app.routes';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  goToAssistance() {
    this.router.navigate([PATH_TO_ASSISTANCE]);
  }

  navigateToTickets() {
    this.router.navigate([PATH_TO_TICKETS]);
  }
}
