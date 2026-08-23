import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';
import { UsersService } from '@app/api/generated/users/users.service';
import { PasswordResetService } from '@app/api/generated/password-reset/password-reset.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersApi: jasmine.SpyObj<UsersService>;
  let passwordResetApi: jasmine.SpyObj<PasswordResetService>;
  let tokenService: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    usersApi = jasmine.createSpyObj<UsersService>('UsersService', ['userLogin', 'userUpdatePassword']);
    passwordResetApi = jasmine.createSpyObj<PasswordResetService>('PasswordResetService', [
      'resetPasswordRequest',
      'resetPasswordValidate',
      'resetPasswordDelete',
    ]);
    tokenService = jasmine.createSpyObj<AuthTokenService>('AuthTokenService', ['setTokens', 'removeTokens']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersApi },
        { provide: PasswordResetService, useValue: passwordResetApi },
        { provide: AuthTokenService, useValue: tokenService },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should login and persist tokens', (done) => {
    const credentials = { username: 'alice', password: 'secret' };
    usersApi.userLogin.and.returnValue(
      of({ access_token: 'access-token', refresh_token: 'refresh-token' } as any)
    );

    service.login(credentials).subscribe((response) => {
      expect(response.access_token).toBe('access-token');
      expect(usersApi.userLogin).toHaveBeenCalledWith(credentials);
      expect(tokenService.setTokens).toHaveBeenCalledWith({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      });
      done();
    });
  });

  it('should clear tokens on logout', () => {
    service.logout();
    expect(tokenService.removeTokens).toHaveBeenCalled();
  });

  it('should delegate forgotPassword request', () => {
    passwordResetApi.resetPasswordRequest.and.returnValue(of('OK' as any));

    const result = service.forgotPassword('alice@example.com');

    expect(passwordResetApi.resetPasswordRequest).toHaveBeenCalledWith({ email: 'alice@example.com' });
    result.subscribe((value) => expect(value).toBe('OK'));
  });

  it('should validate reset token', () => {
    passwordResetApi.resetPasswordValidate.and.returnValue(of({ id: 'user-1', email: 'alice@example.com' } as any));

    const result = service.readToken('token-123');

    expect(passwordResetApi.resetPasswordValidate).toHaveBeenCalledWith({ token: 'token-123' });
    result.subscribe((value) => {
      expect(value).toEqual({ id: 'user-1', email: 'alice@example.com' });
    });
  });

  it('should update password with token and user id', () => {
    const payload = { userName: 'alice', newPassword: 'new-pass' };
    usersApi.userUpdatePassword.and.returnValue(of(undefined as any));

    const result = service.updatePassword('token-456', 'user-1', payload);

    expect(usersApi.userUpdatePassword).toHaveBeenCalledWith(
      'user-1',
      payload,
      jasmine.objectContaining({
        params: { token: 'token-456' },
      })
    );
    result.subscribe((value) => expect(value).toBeUndefined());
  });

  it('should delete a reset token', () => {
    passwordResetApi.resetPasswordDelete.and.returnValue(of({ success: true } as any));

    const result = service.deleteToken('token-789');

    expect(passwordResetApi.resetPasswordDelete).toHaveBeenCalledWith({ token: 'token-789' });
    result.subscribe((value) => expect(value).toEqual({ success: true }));
  });
});
