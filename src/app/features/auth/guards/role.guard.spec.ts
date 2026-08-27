import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  administratorGuard,
  radiologistGuard,
  radioOperatorGuard,
} from './role.guard';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/route-paths';

function createRouterSpy(): jasmine.SpyObj<Router> {
  return jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
}

function createAuthStub(valid: boolean) {
  const spy = jasmine.createSpyObj<AuthTokenService>(
    'AuthTokenService',
    ['tryAutoRefresh', 'isRadiologist', 'isAdministrator', 'isRadioOperator', 'getDefaultRoute']
  );

  spy.tryAutoRefresh.and.returnValue(Promise.resolve(valid));
  spy.isRadiologist.and.returnValue(false);
  spy.isAdministrator.and.returnValue(false);
  spy.isRadioOperator.and.returnValue(false);
  spy.getDefaultRoute.and.returnValue('');

  return spy;
}

describe('role.guard', () => {
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    router = createRouterSpy();
    route = {} as ActivatedRouteSnapshot;
    state = { url: '/protected' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
      ],
    });
  });

  it('redirects unauthenticated users to login', async () => {
    const auth = createAuthStub(false);
    const urlTree = {} as UrlTree;

    router.createUrlTree.and.returnValue(urlTree);
    TestBed.overrideProvider(AuthTokenService, { useValue: auth });

    const result = await TestBed.runInInjectionContext(() =>
      radiologistGuard(route, state)
    );

    expect(auth.tryAutoRefresh).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith([PATH_TO_LOGIN]);
    expect(result).toBe(urlTree);
  });

  it('allows user with correct role', async () => {
    const auth = createAuthStub(true);
    auth.isRadiologist.and.returnValue(true);

    TestBed.overrideProvider(AuthTokenService, { useValue: auth });

    const result = await TestBed.runInInjectionContext(() =>
      radiologistGuard(route, state)
    );

    expect(auth.tryAutoRefresh).toHaveBeenCalled();
    expect(auth.isRadiologist).toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('redirects authenticated user without radiologist role to the default route', async () => {
    const auth = createAuthStub(true);
    const urlTree = {} as UrlTree;

    auth.isRadiologist.and.returnValue(false);
    auth.getDefaultRoute.and.returnValue('tickets');
    router.createUrlTree.and.returnValue(urlTree);

    TestBed.overrideProvider(AuthTokenService, { useValue: auth });

    const result = await TestBed.runInInjectionContext(() =>
      radiologistGuard(route, state)
    );

    expect(auth.tryAutoRefresh).toHaveBeenCalled();
    expect(auth.isRadiologist).toHaveBeenCalled();
    expect(auth.getDefaultRoute).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['tickets']);
    expect(result).toBe(urlTree);
  });

  it('allows administrator when role matches', async () => {
    const auth = createAuthStub(true);
    auth.isAdministrator.and.returnValue(true);

    TestBed.overrideProvider(AuthTokenService, { useValue: auth });

    const result = await TestBed.runInInjectionContext(() =>
      administratorGuard(route, state)
    );

    expect(auth.isAdministrator).toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('allows radio operator when role matches', async () => {
    const auth = createAuthStub(true);
    auth.isRadioOperator.and.returnValue(true);

    TestBed.overrideProvider(AuthTokenService, { useValue: auth });

    const result = await TestBed.runInInjectionContext(() =>
      radioOperatorGuard(route, state)
    );

    expect(auth.isRadioOperator).toHaveBeenCalled();
    expect(result).toBeTrue();
  });
});
