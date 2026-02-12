import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ExtendedJwtPayload } from '@app/features/auth/models/extended-jwt-payload.interface';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  private readonly SESSION_STORAGE_TOKEN_KEY = 'accessToken';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { // To avoid error wit SSR rendering that may consider 'sessionStorage' as undefined.
      return sessionStorage.getItem(this.SESSION_STORAGE_TOKEN_KEY);
    }
    return null;
  }

  setToken(newToken: string) {
    if (isPlatformBrowser(this.platformId)) { // To avoid error wit SSR rendering that may consider 'sessionStorage' as undefined.
      sessionStorage.setItem(this.SESSION_STORAGE_TOKEN_KEY, newToken);
    }
  }

  removeToken() {
    if (isPlatformBrowser(this.platformId)) { // To avoid error wit SSR rendering that may consider 'sessionStorage' as undefined.
      sessionStorage.removeItem(this.SESSION_STORAGE_TOKEN_KEY);
    }
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

  getCompleteName() {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decodedToken: ExtendedJwtPayload = jwtDecode(token);

    return decodedToken.name ? `${decodedToken.name}` : `${decodedToken.given_name} ${decodedToken.family_name}`;
  }

  getUserIdFromToken(): string | null {
  const token = this.getToken();
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(json);
    return (decoded.sub ?? null)?.toString();
  } catch {
    return null;
  }
}

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodedToken: ExtendedJwtPayload = jwtDecode(token);
    return (decodedToken.sub ?? null) as string | null;
  }
}