import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { homeRedirectGuard } from './home-redirect.guard';

describe('homeRedirectGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    auth = jasmine.createSpyObj<AuthTokenService>('AuthTokenService', [
      'tryAutoRefresh',
      'isAuthenticated',
      'getDefaultRoute',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthTokenService, useValue: auth },
      ],
    });
  });

  it('redirects authenticated users to the default route', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(true));
    auth.isAuthenticated.and.returnValue(true);
    auth.getDefaultRoute.and.returnValue('tickets');
    const urlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(urlTree);

    const result = await TestBed.runInInjectionContext(() =>
      homeRedirectGuard({} as any, { url: '/home' } as any)
    );

    expect(auth.tryAutoRefresh).toHaveBeenCalled();
    expect(auth.isAuthenticated).toHaveBeenCalled();
    expect(auth.getDefaultRoute).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['tickets']);
    expect(result).toBe(urlTree);
  });

  it('allows unauthenticated users through to the ***REMOVED*** page route', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(false));

    const result = await TestBed.runInInjectionContext(() =>
      homeRedirectGuard({} as any, { url: '/home' } as any)
    );

    expect(result).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});