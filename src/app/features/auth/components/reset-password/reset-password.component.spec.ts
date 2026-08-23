import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ResetPasswordComponent } from './***REMOVED***.component';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'readToken',
      'updatePassword',
      'deleteToken',
    ]);

    navigationServiceSpy = jasmine.createSpyObj<NavigationService>('NavigationService', [
      'navigateToLogin',
    ]);

    authServiceSpy.readToken.and.returnValue(
      of({
        id: 'user-1',
        email: '***REMOVED***',
      } as any)
    );
    authServiceSpy.updatePassword.and.returnValue(of(undefined as any));
    authServiceSpy.deleteToken.and.returnValue(of(undefined as any));

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ token: 'fake-token' }),
            },
            params: of({}),
            queryParams: of({ token: 'fake-token' }),
            data: of({}),
          },
        },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavigationService, useValue: navigationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user info from the token and reset the error state', () => {
    expect(authServiceSpy.readToken).toHaveBeenCalledWith('fake-token');
    expect(component.userId).toBe('user-1');
    expect(component.email).toBe('***REMOVED***');
    expect(component.isError).toBeFalse();
  });

  it('should block submission when the form is invalid', () => {
    component.resetForm.setValue({
      newPassword: 'weak',
      confirmPassword: 'weak',
    });

    component.onSubmitNewPassword();

    expect(authServiceSpy.updatePassword).not.toHaveBeenCalled();
    expect(component.isError).toBeFalse();
  });

  it('should submit a valid password reset and redirect to ***REMOVED***', fakeAsync(() => {
    component.userId = 'user-1';
    component.email = '***REMOVED***';
    component.token = 'fake-token';
    component.resetForm.setValue({
      newPassword: '***REMOVED***',
      confirmPassword: '***REMOVED***',
    });

    component.onSubmitNewPassword();

    expect(authServiceSpy.updatePassword).toHaveBeenCalledWith('fake-token', 'user-1', {
      userName: '***REMOVED***',
      newPassword: '***REMOVED***',
    });
    expect(authServiceSpy.deleteToken).toHaveBeenCalledWith('fake-token');

    tick(2000);
    expect(navigationServiceSpy.navigateToLogin).toHaveBeenCalled();
  }));

  it('should reject submission when user information is missing', () => {
    component.userId = '';
    component.email = '';
    component.resetForm.setValue({
      newPassword: '***REMOVED***',
      confirmPassword: '***REMOVED***',
    });

    component.onSubmitNewPassword();

    expect(component.isError).toBeTrue();
    expect(authServiceSpy.updatePassword).not.toHaveBeenCalled();
  });
});