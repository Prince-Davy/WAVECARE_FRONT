import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal, computed, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { jwtDecode as decodeJwt } from 'jwt-decode';

import {
  REALM_URL,
  TOKEN_ENDPOINT,
  CLIENT_ID,
  STORAGE_STRATEGY,
} from './auth-config';

interface JwtPayload {
  exp?: number;
  sub?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: { roles: string[] };
  resource_access?: { [client: string]: { roles: string[] } };
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  token: WritableSignal<string | null> = signal(null);
  refresh: WritableSignal<string | null> = signal(null);
  roles = computed<string[]>(() => {
    const t = this.token();
    if (!t) {
      return [];
    }
    try {
      const payload = decodeJwt<JwtPayload>(t);
      const realmRoles = payload.realm_access?.roles || [];
      const clientRoles =
        payload.resource_access?.[CLIENT_ID]?.roles || [];
      return Array.from(new Set([...realmRoles, ...clientRoles]));
    } catch {
      return [];
    }
  });

  private storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage =
        STORAGE_STRATEGY === 'local' ? localStorage : sessionStorage;
      this.initFromStorage();
    }
  }

  initFromStorage(): void {
    if (!this.storage) {
      return;
    }
    const access = this.storage.getItem('access_token');
    const refresh = this.storage.getItem('refresh_token');
    this.token.set(access);
    this.refresh.set(refresh);
  }

  private persistTokens(): void {
    if (!this.storage) {
      return;
    }
    if (this.token()) {
      this.storage.setItem('access_token', this.token()!);
    } else {
      this.storage.removeItem('access_token');
    }
    if (this.refresh()) {
      this.storage.setItem('refresh_token', this.refresh()!);
    } else {
      this.storage.removeItem('refresh_token');
    }
  }

  isTokenValid(): boolean {
    const t = this.token();
    if (!t) {
      return false;
    }
    try {
      const payload = decodeJwt<JwtPayload>(t);
      if (!payload.exp) {
        return false;
      }
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now + 5; // 5s leeway
    } catch {
      return false;
    }
  }

  setTokens(tokens: { access_token: string; refresh_token: string }): void {
    this.token.set(tokens.access_token);
    this.refresh.set(tokens.refresh_token);
    this.persistTokens();
  }

  removeTokens(): void {
    this.token.set(null);
    this.refresh.set(null);
    if (this.storage) {
      this.storage.removeItem('access_token');
      this.storage.removeItem('refresh_token');
    }
  }

  /**
   * perform a refresh request to Keycloak and update tokens
   */
  async refreshTokens(): Promise<void> {
    const refresh = this.refresh();
    if (!refresh) {
      throw new Error('no refresh token');
    }
    const body = new HttpParams({ encoder: new HttpUrlEncodedEncoder() })
      .set('grant_type', 'refresh_token')
      .set('client_id', CLIENT_ID)
      .set('refresh_token', refresh);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const resp = await firstValueFrom(
      this.http.post<any>(TOKEN_ENDPOINT, body.toString(), { headers })
    );
    if (!resp.access_token || !resp.refresh_token) {
      throw new Error('invalid token response');
    }
    this.setTokens({
      access_token: resp.access_token,
      refresh_token: resp.refresh_token,
    });
  }

  private ongoingRefresh: Promise<boolean> | null = null;

  /**
   * try an auto-refresh if the current token is invalid and a refresh token exists
   * returns true if after the call the token is valid
   */
  async tryAutoRefresh(): Promise<boolean> {
    if (this.isTokenValid()) {
      return true;
    }
    if (!this.refresh()) {
      return false;
    }
    if (this.ongoingRefresh) {
      return this.ongoingRefresh;
    }
    this.ongoingRefresh = this.refreshTokens()
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        this.ongoingRefresh = null;
      });
    return this.ongoingRefresh;
  }

  /**
   * ensure that token expiration is not imminent, refresh if it is
   */
  async ensureFreshToken(): Promise<void> {
    if (!this.isTokenValid()) {
      await this.tryAutoRefresh();
    }
  }

  getUserId(): string | null {
    const t = this.token();
    if (!t) {
      return null;
    }
    try {
      const payload = decodeJwt<JwtPayload>(t);
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  getCompleteName(): string | null {
    const t = this.token();
    if (!t) {
      return null;
    }
    try {
      const payload = decodeJwt<JwtPayload>(t);
      return payload.name ||
        [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
        payload.preferred_username ||
        null;
    } catch {
      return null;
    }
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  isAdministrator(): boolean {
    return this.hasRole('administrator');
  }

  isRadiologist(): boolean {
    return this.hasRole('radiologist');
  }

  isRadioOperator(): boolean {
    return this.hasRole('radio_operator');
  }
}

// helper for HttpParams to encode like UrlEncoded
class HttpUrlEncodedEncoder implements HttpParameterCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }
  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }
  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }
}
