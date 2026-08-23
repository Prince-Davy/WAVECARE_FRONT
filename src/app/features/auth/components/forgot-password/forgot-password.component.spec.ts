import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '@app/features/auth/services/auth.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'forgotPassword',
    ]);

    authServiceSpy.forgotPassword.and.returnValue(of('OK'));

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid and stop submission when email is invalid', () => {
    component.form.setValue({ email: 'not-an-email' });

    component.submit();

    expect(component.resetRequestSuccess).toBeFalse();
    expect(component.form.get('email')?.touched).toBeTrue();
    expect(authServiceSpy.forgotPassword).not.toHaveBeenCalled();
  });

  it('should submit a valid request and reset the form on success', () => {
    authServiceSpy.forgotPassword.and.returnValue(of('OK'));
    component.form.setValue({ email: 'alice@example.com' });

    component.submit();

    expect(authServiceSpy.forgotPassword).toHaveBeenCalledWith('alice@example.com');
    expect(component.resetRequestSuccess).toBeTrue();
    expect(component.form.value.email).toBeNull();
  });
});