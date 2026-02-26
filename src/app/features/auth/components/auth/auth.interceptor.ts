import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { TOKEN_ENDPOINT } from '@app/features/auth/services/auth-config';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // don't intercept the token endpoint itself
  if (req.url === TOKEN_ENDPOINT) {
    return next(req);
  }

  const auth = inject(AuthTokenService);
  const token = auth.token();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};
