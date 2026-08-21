import { Injectable, inject } from '@angular/core';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { UsersService } from '@app/api/generated/users/users.service';
import { PasswordResetService } from '@app/api/generated/password-reset/password-reset.service';
import type { TokenResponse } from '@app/api/model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersApi = inject(UsersService);
  private readonly passwordResetApi = inject(PasswordResetService);
  private readonly tokenService = inject(AuthTokenService);

  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    return this.usersApi.userLogin(credentials)
      .pipe(
        tap(response => {
          if (response.access_token && response.refresh_token) {
            this.tokenService.setTokens({
              access_token: response.access_token,
              refresh_token: response.refresh_token,
            });
          }
        }),
        timeout(10000)
      );
  }

  logout() {
    this.tokenService.removeTokens();
  }

  forgotPassword(email: string): Observable<string> {
    return this.passwordResetApi.resetPasswordRequest({ email });
  }

  readToken(token: string): Observable<{ id: string; email: string }> {
    return this.passwordResetApi.resetPasswordValidate({ token }) as Observable<{ id: string; email: string }>;
  }

  updatePassword(token: string | null, userId: string, payload: { userName: string; newPassword: string }): Observable<string> {
    return this.usersApi.userUpdatePassword(userId, payload, {
      params: { token: token! },
    });
  }

  deleteToken(token: string): Observable<unknown> {
    return this.passwordResetApi.resetPasswordDelete({ token });
  }
}
