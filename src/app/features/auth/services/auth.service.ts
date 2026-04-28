import { Injectable, inject } from '@angular/core';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { UsersService } from '@app/api/generated/users/users.service';
import { PasswordResetService } from '@app/api/generated/password-reset/password-reset.service';
import type { TokenResponse } from '@app/api/model';


/**
 * TODO: Documentation for AuthService (class)
 */
/**
 * TODO: Documentation for AuthService (class)
 */
/**
 * TODO: Documentation for AuthService (class)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersApi = inject(UsersService);
  private readonly passwordResetApi = inject(PasswordResetService);
  private readonly tokenService = inject(AuthTokenService);

/**
 * TODO: Documentation for login (method)
 * @param credentials - TODO
 * @returns TODO
 */
  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    return this.usersApi.userLogin(credentials)
      .pipe(
/**
 * TODO: Documentation for tap (method)
 * @param response - TODO
 * @returns TODO
 */
        tap(response => {
/**
 * TODO: Documentation for if (method)
 * @param response.refresh_token - TODO
 * @returns TODO
 */
          if (response.access_token && response.refresh_token) {
            this.tokenService.setTokens({
/**
 * TODO: Documentation for access_token (property)
 */
              access_token: response.access_token,
/**
 * TODO: Documentation for refresh_token (property)
 */
              refresh_token: response.refresh_token,
            });
          }
        }),
/**
 * TODO: Documentation for timeout (method)
 * @param 10000 - TODO
 * @returns TODO
 */
        timeout(10000)
      );
  }

/**
 * TODO: Documentation for logout (method)
 * @returns TODO
 */
  logout() {
    this.tokenService.removeTokens();
  }

/**
 * TODO: Documentation for forgotPassword (method)
 * @param email - TODO
 * @returns TODO
 */
  forgotPassword(email: string): Observable<string> {
    return this.passwordResetApi.resetPasswordRequest({ email });
  }

/**
 * TODO: Documentation for readToken (method)
 * @param token - TODO
 * @returns TODO
 */
  readToken(token: string): Observable<{ id: string; email: string }> {
    return this.passwordResetApi.resetPasswordValidate({ token }) as Observable<{ id: string; email: string }>;
  }

/**
 * TODO: Documentation for updatePassword (method)
 * @param token - TODO
 * @param userId - TODO
 * @param payload - TODO
 * @returns TODO
 */
  updatePassword(token: string | null, userId: string, payload: { userName: string; newPassword: string }): Observable<string> {
    return this.usersApi.userUpdatePassword(userId, payload, {
/**
 * TODO: Documentation for params (property)
 */
      params: { token: token! },
    });
  }

/**
 * TODO: Documentation for deleteToken (method)
 * @param token - TODO
 * @returns TODO
 */
  deleteToken(token: string): Observable<unknown> {
    return this.passwordResetApi.resetPasswordDelete({ token });
  }
}
