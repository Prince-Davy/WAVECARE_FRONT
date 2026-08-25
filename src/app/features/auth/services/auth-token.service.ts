import { Injectable, Inject, PLATFORM_ID, signal, computed, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParameterCodec } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { jwtDecode as decodeJwt } from 'jwt-decode';

import { TOKEN_ENDPOINT, CLIENT_ID, STORAGE_STRATEGY } from './auth-config';
import { PATH_TO_TICKETS, PATH_TO_PATIENTS, PATH_TO_ASSISTANCE, PATH_TO_LOGIN } from '@app/app.routes';

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

  /** Decoded JWT payload, or null when the token is missing or invalid. */
  payload = computed<JwtPayload | null>(() => {
    const current = this.token();
    if (!current) {
      return null;
    }

    try {
      return decodeJwt<JwtPayload>(current);
    } catch {
      return null;
    }
  });

  /** Lightweight user profile derived from the token claims. */
  user = computed(() => {
    const current = this.payload();
    if (!current) {
      return null;
    }

    return {
      id: current.sub ?? null,
      username: current.preferred_username ?? null,
      name: current.name ?? ([current.given_name, current.family_name].filter(Boolean).join(' ') || null),
    };
  });

  /** Expiration timestamp in Unix seconds, or null when unavailable. */
  expiresAt = computed<number | null>(() => this.payload()?.exp ?? null);

  /** True when a token exists and has not expired yet. */
  isAuthenticated = computed(() => {
    const exp = this.expiresAt();
    if (!exp) {
      return false;
    }

    return exp > Math.floor(Date.now() / 1000);
  });

  /** Combined realm and client roles extracted from the token. */
  roles = computed<string[]>(() => {
    const current = this.payload();
    if (!current) {
      return [];
    }

    const realmRoles = current.realm_access?.roles ?? [];
    const clientRoles = current.resource_access?.[CLIENT_ID]?.roles ?? [];
    return Array.from(new Set([...realmRoles, ...clientRoles]));
  });

  private storage: Storage | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private ongoingRefresh: Promise<boolean> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = STORAGE_STRATEGY === 'local' ? localStorage : sessionStorage;
      this.initFromStorage();

      globalThis.addEventListener('storage', (event: StorageEvent) => {
        if (event.storageArea !== this.storage) {
          return;
        }

        if (event.key === 'access_token') {
          this.token.set(event.newValue);
          this.scheduleRefresh();
        }

        if (event.key === 'refresh_token') {
          this.refresh.set(event.newValue);
        }
      });
    }
  }

  /** Restore auth state from the browser storage if available. */
  initFromStorage(): void {
    if (!this.storage) {
      return;
    }

    const accessToken = this.storage.getItem('access_token');
    const refreshToken = this.storage.getItem('refresh_token');
    this.token.set(accessToken);
    this.refresh.set(refreshToken);
    this.scheduleRefresh();
  }

  /** Store the current tokens into the configured browser storage. */
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

  /** Save a fresh token pair and schedule the next refresh window. */
  setTokens(tokens: { access_token: string; refresh_token: string }): void {
    this.token.set(tokens.access_token);
    this.refresh.set(tokens.refresh_token);
    this.persistTokens();
    this.scheduleRefresh();
  }

  /** Clear all auth data and cancel the refresh timer. */
  removeTokens(): void {
    this.token.set(null);
    this.refresh.set(null);

    if (this.storage) {
      this.storage.removeItem('access_token');
      this.storage.removeItem('refresh_token');
    }

    this.clearRefreshTimer();
  }

  /** Refresh the access token using the configured refresh token. */
  async refreshTokens(): Promise<void> {
    const currentRefresh = this.refresh();
    if (!currentRefresh) {
      throw new Error('no refresh token');
    }

    const response = await firstValueFrom(
      this.http.post<any>(TOKEN_ENDPOINT, { refreshToken: currentRefresh }),
    );

    if (!response.access_token || !response.refresh_token) {
      throw new Error('invalid token response');
    }

    this.setTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  }

  /** Schedule a refresh shortly before expiration to keep the session valid. */
  private scheduleRefresh(): void {
    this.clearRefreshTimer();

    const exp = this.expiresAt();
    if (!exp) {
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const msUntil = (exp - now - 60) * 1000;

    if (msUntil <= 0) {
      void this.tryAutoRefresh();
      return;
    }

    this.refreshTimer = setTimeout(() => {
      void this.tryAutoRefresh();
    }, msUntil);
  }

  /** Clear any pending automatic refresh timer. */
  private clearRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /** Try to refresh the token only when the current one is expired or invalid. */
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

  /** Validate the JWT before a protected action uses it. */
  isTokenValid(): boolean {
    const current = this.token();
    if (!current) {
      return false;
    }

    try {
      const payload = decodeJwt<JwtPayload>(current);
      const exp = payload.exp;
      return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  /** Refresh the token if there is no valid active session. */
  async ensureFreshToken(): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.tryAutoRefresh();
    }
  }

  /** Return the user identifier stored in the JWT subject claim. */
  getUserId(): string | null {
    const current = this.token();
    if (!current) {
      return null;
    }

    try {
      const payload = decodeJwt<JwtPayload>(current);
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  /** Return the best available display name for the current user. */
  getCompleteName(): string | null {
    const current = this.token();
    if (!current) {
      return null;
    }

    try {
      const payload = decodeJwt<JwtPayload>(current);
      return (
        payload.name ??
        ([payload.given_name, payload.family_name].filter(Boolean).join(' ') || payload.preferred_username || null)
      );
    } catch {
      return null;
    }
  }

  /** Check whether the current user has a given role. */
  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  /** True when the role is administrator. */
  isAdministrator(): boolean {
    return this.hasRole('administrator');
  }

  /** True when the role is radiologist. */
  isRadiologist(): boolean {
    return this.hasRole('radiologist');
  }

  /** True when the role is radio operator. */
  isRadioOperator(): boolean {
    return this.hasRole('radio_operator');
  }

  /** Return the default landing page according to the user role. */
  getDefaultRoute(): string {
    if (this.isAdministrator()) {
      return PATH_TO_TICKETS;
    }
    if (this.isRadiologist()) {
      return PATH_TO_PATIENTS;
    }
    if (this.isRadioOperator()) {
      return PATH_TO_ASSISTANCE;
    }
    return PATH_TO_LOGIN;
  }
}

class HttpUrlEncodedEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

