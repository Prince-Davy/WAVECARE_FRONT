import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, Subject, throwError, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthTokenService } from '../../services/auth-token.service';
import { TOKEN_ENDPOINT } from '../../services/auth-config';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private auth: AuthTokenService,
    @Inject(NavigationService) private nav: NavigationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // never add token to token endpoint requests
    if (req.url === TOKEN_ENDPOINT) {
      return next.handle(req);
    }

    const authReq = this.addToken(req);
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.handle401(authReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.auth.token();
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return req;
  }

  private handle401(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      // start refresh
      return from(this.auth.refreshTokens()).pipe(
        switchMap(() => {
          this.refreshInProgress = false;
          this.refreshSubject.next(true);
          return next.handle(this.addToken(req));
        }),
        catchError((refreshErr) => {
          this.refreshInProgress = false;
          this.refreshSubject.next(false);
          this.auth.removeTokens();
          this.nav.navigateToLogin();
          return throwError(() => refreshErr);
        })
      );
    } else {
      // wait for ongoing refresh
      return this.refreshSubject.pipe(
        filter((v) => v !== null),
        take(1),
        switchMap((success) => {
          if (success) {
            return next.handle(this.addToken(req));
          }
          this.auth.removeTokens();
          this.nav.navigateToLogin();
          return throwError(() => new Error('refresh failed'));
        })
      );
    }
  }
}
