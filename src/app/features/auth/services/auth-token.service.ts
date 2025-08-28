import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  private readonly SESSION_STORAGE_TOKEN_KEY = 'accessToken';

  constructor() { }

  getToken(): string | null {
    return sessionStorage.getItem(this.SESSION_STORAGE_TOKEN_KEY);
  }

  setToken(newToken: string) {
    sessionStorage.setItem(this.SESSION_STORAGE_TOKEN_KEY, newToken);
  }

  removeToken() {
    sessionStorage.removeItem(this.SESSION_STORAGE_TOKEN_KEY);
  }

  /**
   * Checks if the current token is still valid.
   *
   * @returns true if the token is valid, false otherwise
   */
  isTokenValid(): boolean {
    const token: string | null = this.getToken();
    if (!token) {
      return false;
    }
    return jwtDecode(token).exp! > (Date.now() / 1000);
  }
}
