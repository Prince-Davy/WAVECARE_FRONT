/**
 * Authentication Service Module
 * 
 * Provides authentication and token management functionality for the Wavecare application.
 * Handles login, logout, password reset, and token validation operations.
 * 
 * @module AuthService
 * @see {@link AuthService} for the service class
 */
import { Injectable, inject } from '@angular/core';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { UsersService } from '@app/api/generated/users/users.service';
import { PasswordResetService } from '@app/api/generated/password-reset/password-reset.service';
import type { TokenResponse } from '@app/api/model';


/**
<<<<<<< Updated upstream
 * TODO: Documentation for AuthService (class)
 */
/**
 * TODO: Documentation for AuthService (class)
 */
/**
 * TODO: Documentation for AuthService (class)
=======
 * Authentication Service
 * 
 * Manages user authentication operations including:
 * - User login with credentials
 * - User logout and token cleanup
 * - Password reset flow (request and validation)
 * - Password update functionality
 * 
 * @class AuthService
 * @injectable
 * @see {@link AuthTokenService} for token management
 * @see {@link UsersService} for user API operations
 * @see {@link PasswordResetService} for password reset API operations
>>>>>>> Stashed changes
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersApi = inject(UsersService);
  private readonly passwordResetApi = inject(PasswordResetService);
  private readonly tokenService = inject(AuthTokenService);

<<<<<<< Updated upstream
/**
 * TODO: Documentation for login (method)
 * @param credentials - TODO
 * @returns TODO
 */
=======
  /**
   * Authenticate a user with username and password
   * 
   * Sends login credentials to the API and on successful authentication,
   * stores the received access and refresh tokens.
   * 
   * @method login
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.username - The user's username or email
   * @param {string} credentials.password - The user's password
   * @returns {Observable<TokenResponse>} Observable containing the authentication tokens
   * @throws {Error} If login fails after 10 seconds timeout
   * @example
   * authService.login({ username: 'user@example.com', password: 'password123' })
   *   .subscribe(tokens => {
   *     console.log('Login successful');
   *   });
   */
>>>>>>> Stashed changes
  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    return this.usersApi.userLogin(credentials)
      .pipe(
        tap(response => {
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

<<<<<<< Updated upstream
/**
 * TODO: Documentation for logout (method)
 * @returns TODO
 */
=======
  /**
   * Log out the current user
   * 
   * Removes all authentication tokens from local storage.
   * Does not require API call.
   * 
   * @method logout
   * @returns {void}
   * @example
   * authService.logout();
   */
>>>>>>> Stashed changes
  logout() {
    this.tokenService.removeTokens();
  }

<<<<<<< Updated upstream
/**
 * TODO: Documentation for forgotPassword (method)
 * @param email - TODO
 * @returns TODO
 */
=======
  /**
   * Request a password reset email
   * 
   * Sends a password reset request to the API.
   * If the email exists, a reset link will be sent.
   * 
   * @method forgotPassword
   * @param {string} email - The user's email address
   * @returns {Observable<string>} Observable containing the API response
   * @example
   * authService.forgotPassword('user@example.com').subscribe(response => {
   *   console.log('Reset email sent');
   * });
   */
>>>>>>> Stashed changes
  forgotPassword(email: string): Observable<string> {
    return this.passwordResetApi.resetPasswordRequest({ email });
  }

<<<<<<< Updated upstream
/**
 * TODO: Documentation for readToken (method)
 * @param token - TODO
 * @returns TODO
 */
=======
  /**
   * Validate a password reset token
   * 
   * Checks if a reset token is valid and not expired.
   * Returns the user ID and email associated with the token.
   * 
   * @method readToken
   * @param {string} token - The password reset token
   * @returns {Observable<{ id: string; email: string }>} Observable containing user ID and email
   * @example
   * authService.readToken('reset-token-123').subscribe(info => {
   *   console.log('User ID:', info.id);
   * });
   */
>>>>>>> Stashed changes
  readToken(token: string): Observable<{ id: string; email: string }> {
    return this.passwordResetApi.resetPasswordValidate({ token }) as Observable<{ id: string; email: string }>;
  }

<<<<<<< Updated upstream
/**
 * TODO: Documentation for updatePassword (method)
 * @param token - TODO
 * @param userId - TODO
 * @param payload - TODO
 * @returns TODO
 */
=======
  /**
   * Update a user's password
   * 
   * Validates the reset token and updates the user's password.
   * 
   * @method updatePassword
   * @param {string | null} token - The password reset token
   * @param {string} userId - The ID of the user
   * @param {Object} payload - Password update information
   * @param {string} payload.userName - The username
   * @param {string} payload.newPassword - The new password
   * @returns {Observable<string>} Observable containing the API response
   * @example
   * authService.updatePassword(token, userId, {
   *   userName: 'user@example.com',
   *   newPassword: 'newPassword123'
   * }).subscribe(response => {
   *   console.log('Password updated');
   * });
   */
>>>>>>> Stashed changes
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
