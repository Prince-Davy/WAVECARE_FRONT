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

// route constants needed for role-based default navigation
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

/**
 * TODO: Documentation for AuthTokenService (class)
 */
/**
 * TODO: Documentation for AuthTokenService (class)
 */
/**
 * TODO: Documentation for AuthTokenService (class)
 */
/**
 * TODO: Documentation for AuthTokenService (class)
 */
@Injectable({ providedIn: 'root' })
export class AuthTokenService {
/**
 * TODO: Documentation for token (property)
 */
  token: WritableSignal<string | null> = signal(null);
/**
 * TODO: Documentation for refresh (property)
 */
  refresh: WritableSignal<string | null> = signal(null);

  /** decoded JWT payload or null if not available/parsing failed */
  payload = computed<JwtPayload | null>(() => {
    const t = this.token();
/**
 * TODO: Documentation for if (method)
 * @param !t - TODO
 * @returns TODO
 */
    if (!t) {
      return null;
    }
    try {
      return decodeJwt<JwtPayload>(t);
    } catch {
      return null;
    }
  });

  /** user object derived from payload for easy consumption */
  user = computed(() => {
    const p = this.payload();
/**
 * TODO: Documentation for if (method)
 * @param !p - TODO
 * @returns TODO
 */
    if (!p) {
      return null;
    }
    return {
/**
 * TODO: Documentation for id (property)
 */
      id: p.sub ?? null,
/**
 * TODO: Documentation for username (property)
 */
      username: p.preferred_username ?? null,
/**
 * TODO: Documentation for name (property)
 */
      name:
        p.name ||
        [p.given_name, p.family_name].filter(Boolean).join(' ') ||
        null,
    };
  });

  /** expiration timestamp (seconds since epoch) or null */
  expiresAt = computed<number | null>(() => {
    const p = this.payload();
    return p?.exp ?? null;
  });

  /** true when there is a token that hasn't expired yet */
  isAuthenticated = computed(() => {
    const exp = this.expiresAt();
/**
 * TODO: Documentation for if (method)
 * @param !exp - TODO
 * @returns TODO
 */
    if (!exp) {
      return false;
    }
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  });

  roles = computed<string[]>(() => {
    const p = this.payload();
/**
 * TODO: Documentation for if (method)
 * @param !p - TODO
 * @returns TODO
 */
    if (!p) {
      return [];
    }
    const realmRoles = p.realm_access?.roles || [];
    const clientRoles = p.resource_access?.[CLIENT_ID]?.roles || [];
    return Array.from(new Set([...realmRoles, ...clientRoles]));
  });

/**
 * TODO: Documentation for storage (property)
 */
  private storage: Storage | null = null;
/**
 * TODO: Documentation for refreshTimer (property)
 */
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * TODO: Documentation for constructor (method)
 * @param http - TODO
 * @param @Inject(PLATFORM_ID - TODO
 * @returns TODO
 */
  constructor(
/**
 * TODO: Documentation for http (property)
 */
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
/**
 * TODO: Documentation for if (method)
 * @param isPlatformBrowser(this.platformId) - TODO
 * @returns TODO
 */
    if (isPlatformBrowser(this.platformId)) {
      this.storage =
        STORAGE_STRATEGY === 'local' ? localStorage : sessionStorage;
      this.initFromStorage();

      // listen to other tabs making changes
      window.addEventListener('storage', (ev) => {
/**
 * TODO: Documentation for if (method)
 * @param ! - TODO
 * @returns TODO
 */
        if (ev.storageArea !== this.storage) {
/**
 * TODO: Documentation for return (property)
 */
          return;
        }
/**
 * TODO: Documentation for if (method)
 * @param ev.key - TODO
 * @returns TODO
 */
        if (ev.key === 'access_token') {
          this.token.set(ev.newValue);
          this.scheduleRefresh();
        }
/**
 * TODO: Documentation for if (method)
 * @param ev.key - TODO
 * @returns TODO
 */
        if (ev.key === 'refresh_token') {
          this.refresh.set(ev.newValue);
        }
      });
    }
  }

/**
 * TODO: Documentation for initFromStorage (method)
 * @returns TODO
 */
  initFromStorage(): void {
/**
 * TODO: Documentation for if (method)
 * @param !this.storage - TODO
 * @returns TODO
 */
    if (!this.storage) {
/**
 * TODO: Documentation for return (property)
 */
      return;
    }
    const access = this.storage.getItem('access_token');
    const refresh = this.storage.getItem('refresh_token');
    this.token.set(access);
    this.refresh.set(refresh);
    this.scheduleRefresh();
  }

/**
 * TODO: Documentation for persistTokens (method)
 * @returns TODO
 */
  private persistTokens(): void {
/**
 * TODO: Documentation for if (method)
 * @param !this.storage - TODO
 * @returns TODO
 */
    if (!this.storage) {
/**
 * TODO: Documentation for return (property)
 */
      return;
    }
/**
 * TODO: Documentation for if (method)
 * @param this.token() - TODO
 * @returns TODO
 */
    if (this.token()) {
      this.storage.setItem('access_token', this.token()!);
    } else {
      this.storage.removeItem('access_token');
    }
/**
 * TODO: Documentation for if (method)
 * @param this.refresh() - TODO
 * @returns TODO
 */
    if (this.refresh()) {
      this.storage.setItem('refresh_token', this.refresh()!);
    } else {
      this.storage.removeItem('refresh_token');
    }
  }

  /** legacy helper, mostly replaced by computed `isAuthenticated` */
  isTokenValid(): boolean {
    // keep a small leeway to avoid clock skew
    return this.isAuthenticated() && (this.expiresAt()! > Math.floor(Date.now() / 1000) + 5);
  }

/**
 * TODO: Documentation for setTokens (method)
 * @param tokens - TODO
 * @returns TODO
 */
  setTokens(tokens: { access_token: string; refresh_token: string }): void {
    this.token.set(tokens.access_token);
    this.refresh.set(tokens.refresh_token);
    this.persistTokens();
    this.scheduleRefresh();
  }

/**
 * TODO: Documentation for removeTokens (method)
 * @returns TODO
 */
  removeTokens(): void {
    this.token.set(null);
    this.refresh.set(null);
/**
 * TODO: Documentation for if (method)
 * @param this.storage - TODO
 * @returns TODO
 */
    if (this.storage) {
      this.storage.removeItem('access_token');
      this.storage.removeItem('refresh_token');
    }
    this.clearRefreshTimer();
  }

  /**
   * perform a refresh request to Keycloak and update tokens
   */
/**
 * TODO: Documentation for refreshTokens (method)
 * @returns TODO
 */
  async refreshTokens(): Promise<void> {
    const refresh = this.refresh();
/**
 * TODO: Documentation for if (method)
 * @param !refresh - TODO
 * @returns TODO
 */
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
/**
 * TODO: Documentation for if (method)
 * @param !resp.refresh_token - TODO
 * @returns TODO
 */
    if (!resp.access_token || !resp.refresh_token) {
      throw new Error('invalid token response');
    }
    this.setTokens({
/**
 * TODO: Documentation for access_token (property)
 */
      access_token: resp.access_token,
/**
 * TODO: Documentation for refresh_token (property)
 */
      refresh_token: resp.refresh_token,
    });
  }

/**
 * TODO: Documentation for ongoingRefresh (property)
 */
  private ongoingRefresh: Promise<boolean> | null = null;

  /** schedule a proactive refresh 60 seconds before expiration */
  private scheduleRefresh(): void {
    this.clearRefreshTimer();
    const exp = this.expiresAt();
/**
 * TODO: Documentation for if (method)
 * @param !exp - TODO
 * @returns TODO
 */
    if (!exp) {
/**
 * TODO: Documentation for return (property)
 */
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const msUntil = (exp - now - 60) * 1000;
/**
 * TODO: Documentation for if (method)
 * @param < - TODO
 * @returns TODO
 */
    if (msUntil <= 0) {
      // already too close or expired, trigger immediately
      void this.tryAutoRefresh();
/**
 * TODO: Documentation for return (property)
 */
      return;
    }
    this.refreshTimer = setTimeout(() => {
      void this.tryAutoRefresh();
    }, msUntil);
  }

/**
 * TODO: Documentation for clearRefreshTimer (method)
 * @returns TODO
 */
  private clearRefreshTimer(): void {
/**
 * TODO: Documentation for if (method)
 * @param ! - TODO
 * @returns TODO
 */
    if (this.refreshTimer !== null) {
/**
 * TODO: Documentation for clearTimeout (method)
 * @param this.refreshTimer - TODO
 * @returns TODO
 */
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * try an auto-refresh if the current token is invalid and a refresh token exists
   * returns true if after the call the token is valid
   */
/**
 * TODO: Documentation for tryAutoRefresh (method)
 * @returns TODO
 */
  async tryAutoRefresh(): Promise<boolean> {
/**
 * TODO: Documentation for if (method)
 * @param this.isTokenValid() - TODO
 * @returns TODO
 */
    if (this.isTokenValid()) {
      return true;
    }
/**
 * TODO: Documentation for if (method)
 * @param !this.refresh() - TODO
 * @returns TODO
 */
    if (!this.refresh()) {
      return false;
    }
/**
 * TODO: Documentation for if (method)
 * @param this.ongoingRefresh - TODO
 * @returns TODO
 */
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
/**
 * TODO: Documentation for ensureFreshToken (method)
 * @returns TODO
 */
  async ensureFreshToken(): Promise<void> {
/**
 * TODO: Documentation for if (method)
 * @param !this.isAuthenticated() - TODO
 * @returns TODO
 */
    if (!this.isAuthenticated()) {
      await this.tryAutoRefresh();
    }
  }

/**
 * TODO: Documentation for getUserId (method)
 * @returns TODO
 */
  getUserId(): string | null {
    const t = this.token();
/**
 * TODO: Documentation for if (method)
 * @param !t - TODO
 * @returns TODO
 */
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

/**
 * TODO: Documentation for getCompleteName (method)
 * @returns TODO
 */
  getCompleteName(): string | null {
    const t = this.token();
/**
 * TODO: Documentation for if (method)
 * @param !t - TODO
 * @returns TODO
 */
    if (!t) {
      return null;
    }
    try {
      const payload = decodeJwt<JwtPayload>(t);
      return payload.name ||
        [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
        payload.preferred_username ||
/**
 * TODO: Documentation for null (property)
 */
        null;
    } catch {
      return null;
    }
  }

/**
 * TODO: Documentation for hasRole (method)
 * @param role - TODO
 * @returns TODO
 */
  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

/**
 * TODO: Documentation for isAdministrator (method)
 * @returns TODO
 */
  isAdministrator(): boolean {
    return this.hasRole('administrator');
  }

/**
 * TODO: Documentation for isRadiologist (method)
 * @returns TODO
 */
  isRadiologist(): boolean {
    return this.hasRole('radiologist');
  }

/**
 * TODO: Documentation for isRadioOperator (method)
 * @returns TODO
 */
  isRadioOperator(): boolean {
    return this.hasRole('radio_operator');
  }

  /**
   * Return the canonical "home" route for the currently authenticated user.
   * This encapsulates the role‑based logic used throughout the app.
   */
/**
 * TODO: Documentation for getDefaultRoute (method)
 * @returns TODO
 */
  getDefaultRoute(): string {
/**
 * TODO: Documentation for if (method)
 * @param this.isAdministrator() - TODO
 * @returns TODO
 */
    if (this.isAdministrator()) {
      return PATH_TO_TICKETS;
    }
/**
 * TODO: Documentation for if (method)
 * @param this.isRadiologist() - TODO
 * @returns TODO
 */
    if (this.isRadiologist()) {
      return PATH_TO_PATIENTS;
    }
/**
 * TODO: Documentation for if (method)
 * @param this.isRadioOperator() - TODO
 * @returns TODO
 */
    if (this.isRadioOperator()) {
      return PATH_TO_ASSISTANCE;
    }
    return PATH_TO_LOGIN;
  }
}


// helper for HttpParams to encode like UrlEncoded
class HttpUrlEncodedEncoder implements HttpParameterCodec {
/**
 * TODO: Documentation for encodeKey (method)
 * @param k - TODO
 * @returns TODO
 */
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }
/**
 * TODO: Documentation for encodeValue (method)
 * @param v - TODO
 * @returns TODO
 */
  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
/**
 * TODO: Documentation for decodeKey (method)
 * @param k - TODO
 * @returns TODO
 */
  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }
/**
 * TODO: Documentation for decodeValue (method)
 * @param v - TODO
 * @returns TODO
 */
  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }
}
