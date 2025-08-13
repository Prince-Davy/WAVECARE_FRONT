import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginResponse } from '@app/core/auth/models/auth.types';
import { AuthService } from '@app/core/auth/services/auth.service';
import { DashboardComponent } from '@app/features/dashboard/dashboard.component';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUser$', 'getCurrentRole', 'logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);  // N'ajoutez plus le composant dans "declarations"
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait mettre à jour currentUser et userRole à l\'initialisation', () => {
    const mockUser: LoginResponse = {
      access_token: 'fake-access-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'read write',
      role: 'ADMIN'
    };

    authServiceSpy.currentUser$ = of(mockUser);
    authServiceSpy.getCurrentRole.and.returnValue('ADMIN');

    fixture.detectChanges(); // Déclenche ngOnInit

    expect(component.currentUser).toEqual(mockUser);
    expect(component.userRole).toEqual('ADMIN');
  });

  it('devrait appeler logout et naviguer vers la page de connexion', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.currentUser).toBeNull();
    expect(component.userRole).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/***REMOVED***']);
  });

  it('devrait retourner le token décodé', () => {
    const mockToken = 'fake.access.token';
    const decodedToken = { exp: 1672449600 }; // exp = 31 décembre 2022

    spyOn(window, 'atob').and.returnValue(JSON.stringify(decodedToken));
    component.currentUser = { access_token: mockToken } as LoginResponse;

    const result = component.getDecodedToken();

    expect(result).toEqual(decodedToken);
  });

  it('devrait retourner la date d\'expiration du token', () => {
    const mockToken = 'fake.access.token';
    const decodedToken = { exp: 1672449600 }; // exp = 31 décembre 2022

    spyOn(window, 'atob').and.returnValue(JSON.stringify(decodedToken));
    component.currentUser = { access_token: mockToken } as LoginResponse;

    const result = component.getTokenExpiration();

    expect(result).toBe(new Date(decodedToken.exp * 1000).toLocaleString());
  });

  it('devrait retourner "N/A" si aucun token n\'est présent dans getTokenExpiration', () => {
    component.currentUser = { access_token: '' } as LoginResponse;

    const result = component.getTokenExpiration();

    expect(result).toBe('N/A');
  });
});
