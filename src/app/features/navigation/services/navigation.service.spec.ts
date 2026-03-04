import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { PATH_TO_TICKETS, PATH_TO_PATIENTS, PATH_TO_ASSISTANCE, PATH_TO_LOGIN } from '@app/app.routes';

describe('NavigationService', () => {
  let service: NavigationService;
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthTokenService', ['getDefaultRoute']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthTokenService, useValue: authSpy },
      ],
    });
    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    auth = TestBed.inject(AuthTokenService) as jasmine.SpyObj<AuthTokenService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('navigateToHome forwards to default route', () => {
    auth.getDefaultRoute.and.returnValue(PATH_TO_PATIENTS);
    service.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith([PATH_TO_PATIENTS]);
  });
});
