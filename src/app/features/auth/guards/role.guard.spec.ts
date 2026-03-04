import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { administratorGuard, radiologistGuard, radioOperatorGuard } from './role.guard';
import { AuthTokenService } from '../services/auth-token.service';
import { PATH_TO_LOGIN } from '@app/app.routes';

function createRouterSpy(): jasmine.SpyObj<Router> {
  return jasmine.createSpyObj('Router', ['createUrlTree']);
}

function createAuthStub(valid: boolean, roleCheck: (auth: AuthTokenService) => boolean) {
  const spy = jasmine.createSpyObj<AuthTokenService>(['tryAutoRefresh']);
  (spy.tryAutoRefresh as any).and.returnValue(Promise.resolve(valid));
  spy.isRadiologist = () => roleCheck(spy as any);
  spy.isAdministrator = () => roleCheck(spy as any);
  spy.isRadioOperator = () => roleCheck(spy as any);
  return spy;
}

describe('role.guard', () => {
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = createRouterSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
      ],
    });
  });

  it('redirects unauthenticated users to login', async () => {
    const guard = radiologistGuard;
    const result = await guard();
    expect(result instanceof UrlTree).toBeTrue();
  });

  it('allows user with correct role', async () => {
    const auth = createAuthStub(true, () => true);
    spyOn<any>(auth, 'isRadiologist').and.returnValue(true);
    TestBed.overrideProvider(AuthTokenService, { useValue: auth });
    const guard = radiologistGuard;
    const res = await guard();
    expect(res).toBeTrue();
  });
});
