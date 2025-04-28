import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
  
  }

  goToHome(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      const isValidToken = token && this.authService.isTokenValid();
      
      console.log('Redirection depuis goToHome - Token valide:', isValidToken);
      
      if (isValidToken) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/***REMOVED***']);
      }
    } else {
      this.router.navigate(['/***REMOVED***']);
    }
  }
}