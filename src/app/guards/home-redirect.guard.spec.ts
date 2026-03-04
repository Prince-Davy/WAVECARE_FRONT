import { homeRedirectGuard } from './home-redirect.guard';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

describe('homeRedirectGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    auth = jasmine.createSpyObj('AuthTokenService', ['tryAutoRefresh', 'isAuthenticated', 'getDefaultRoute']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthTokenService, useValue: auth },
      ],
    });
  });

  it('lets unauthenticated users proceed', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(false));
    auth.isAuthenticated.and.returnValue(false);
    const result = await homeRedirectGuard();
    expect(result).toBeTrue();
  });

  it('redirects authenticated users to default', async () => {
    auth.tryAutoRefresh.and.returnValue(Promise.resolve(true));
    auth.isAuthenticated.and.returnValue(true);
    auth.getDefaultRoute.and.returnValue(PATH_TO_LOGIN);
    const tree = {} as UrlTree;
    router.createUrlTree.and.returnValue(tree);

    const result = await homeRedirectGuard();
    expect(result).toBe(tree);
    expect(router.createUrlTree).toHaveBeenCalledWith([PATH_TO_LOGIN]);
  });
});
