
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LoginResponse } from '@app/features/auth/models/auth.types';
import { AuthService } from '@app/features/auth/services/auth.service';
import { Subscription } from 'rxjs';

import { FooterComponent } from '@app/features/dashboard/components/footer/footer.component';
import { NavbarComponent } from '@app/features/dashboard/components/navbar/navbar.component';
import { TicketTableComponent } from '@app/features/ticket-table/ticket-table-component/ticket-table.component';


@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    TicketTableComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})


export class DashboardComponent implements OnInit, OnDestroy {

  currentUser: LoginResponse | null = null;
  userRole: string | undefined;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.userRole = this.authService.getCurrentRole();
        }
      })
    );
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.userRole = undefined;
    this.router.navigate(['/***REMOVED***']);
  }


  getDecodedToken(): any {
    if (this.currentUser?.access_token) {
      return JSON.parse(atob(this.currentUser.access_token.split('.')[1]));
    }
    return null;
  }


  getTokenExpiration(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken?.exp) {
      return new Date(decodedToken.exp * 1000).toLocaleString();
    }
    return 'N/A';
  }
}
