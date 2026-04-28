import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { TOKEN_ENDPOINT } from '@app/features/auth/services/auth-config';

/**
 * TODO: Documentation for authInterceptor (const)
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthTokenService);

  // don't attach to token endpoint itself
  if (req.url === TOKEN_ENDPOINT) {
    return next(req);
  }

  const withAuth = (token: string | null) => {
    if (token) {
      return next(
        req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      );
    }
    return next(req);
  };

  // we always try to refresh before sending if token is about to expire
  const preflight$ = auth.ensureFreshToken().then(() => auth.token());

  return from(preflight$).pipe(
    switchMap((tk) => withAuth(tk)),
    catchError((err) => {
      // if we received 401, attempt a refresh + retry once
      if (err?.status === 401) {
        return from(auth.tryAutoRefresh()).pipe(
          switchMap((success) => {
            if (success && auth.token()) {
              return withAuth(auth.token());
            }
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
