import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { PATH_TO_LOGIN } from '@app/app.routes';
import { AuthTokenService } from '../services/auth-token.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    auth = jasmine.createSpyObj<AuthTokenService>('AuthTokenService', [
      'tryAutoRefresh',
      'isAuthenticated',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthTokenService, useValue: auth },
      ],
    });
  });

  it('allows access when auto refresh succeeds and the user is authenticated', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(true));
    auth.isAuthenticated.and.returnValue(true);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/tickets' } as any));

    expect(auth.tryAutoRefresh).toHaveBeenCalled();
    expect(auth.isAuthenticated).toHaveBeenCalled();
    expect(result).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to ***REMOVED*** when refresh fails', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(false));
    const urlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(urlTree);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/tickets' } as any));

    expect(router.createUrlTree).toHaveBeenCalledWith([PATH_TO_LOGIN]);
    expect(result).toBe(urlTree);
  });

  it('redirects to ***REMOVED*** when the user is not authenticated after refresh', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(true));
    auth.isAuthenticated.and.returnValue(false);
    const urlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(urlTree);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/tickets' } as any));

    expect(auth.isAuthenticated).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith([PATH_TO_LOGIN]);
    expect(result).toBe(urlTree);
  });
});
