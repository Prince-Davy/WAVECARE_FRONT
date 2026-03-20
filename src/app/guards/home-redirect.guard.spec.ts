import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthService } from '@app/features/auth/services/auth.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { ResetPasswordComponent } from '@app/features/auth/components/***REMOVED***/***REMOVED***.component';

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
    authServiceSpy.updatePassword.and.returnValue(of('OK'));
    authServiceSpy.deleteToken.and.returnValue(of('OK'));

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
});