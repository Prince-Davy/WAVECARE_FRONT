import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthTokenService } from './auth-token.service';
import { TOKEN_ENDPOINT, CLIENT_ID } from './auth-config';
import { PATH_TO_TICKETS, PATH_TO_ASSISTANCE } from '@app/app.routes';

function base64UrlEncode(value: string): string {
  return window
    .btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function createJwt(payload: object): string {
  const header = { alg: 'none', typ: 'JWT' };
  return `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;
}

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(AuthTokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.removeTokens();
    sessionStorage.clear();
  });

  it('should decode token payload and derive user properties', () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      exp: now + 3600,
      sub: 'user-1',
      preferred_username: 'user1',
      given_name: 'Jane',
      family_name: 'Doe',
      name: 'Jane Doe',
      realm_access: { roles: ['administrator'] },
      resource_access: { [CLIENT_ID]: { roles: ['radiologist'] } },
    };
    const token = createJwt(payload);

    service.setTokens({ access_token: token, refresh_token: 'refresh-token' });

    expect(service.token()).toBe(token);
    expect(service.refresh()).toBe('refresh-token');
    expect(service.payload()).toEqual(payload);
    expect(service.user()).toEqual({ id: 'user-1', username: 'user1', name: 'Jane Doe' });
    expect(service.expiresAt()).toBe(payload.exp);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isTokenValid()).toBeTrue();
    expect(service.roles()).toEqual(['administrator', 'radiologist']);
    expect(service.hasRole('administrator')).toBeTrue();
    expect(service.isAdministrator()).toBeTrue();
    expect(service.isRadiologist()).toBeTrue();
    expect(service.isRadioOperator()).toBeFalse();
    expect(service.getDefaultRoute()).toBe(PATH_TO_TICKETS);
    expect(sessionStorage.getItem('access_token')).toBe(token);
    expect(sessionStorage.getItem('refresh_token')).toBe('refresh-token');
  });

  it('should fallback to name from given_name and family_name and choose assistance route', () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      exp: now + 3600,
      sub: 'user-2',
      preferred_username: 'op2',
      given_name: 'Radio',
      family_name: 'Operator',
      resource_access: { [CLIENT_ID]: { roles: ['radio_operator'] } },
    };
    const token = createJwt(payload);

    service.setTokens({ access_token: token, refresh_token: 'refresh-2' });

    expect(service.getCompleteName()).toBe('Radio Operator');
    expect(service.getDefaultRoute()).toBe(PATH_TO_ASSISTANCE);
  });

  it('should refresh tokens with valid backend response', async () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = { exp: now + 3600, sub: 'user-3' };
    service.setTokens({ access_token: createJwt(payload), refresh_token: 'refresh-3' });

    const refreshedPayload = { exp: now + 7200, sub: 'user-3' };
    const refreshedToken = createJwt(refreshedPayload);

    const refreshPromise = service.refreshTokens();

    const req = httpMock.expectOne(TOKEN_ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      refreshToken: 'refresh-3',
    });


    req.flush({ access_token: refreshedToken, refresh_token: 'refreshed-refresh' });
    await refreshPromise;

    expect(service.token()).toBe(refreshedToken);
    expect(service.refresh()).toBe('refreshed-refresh');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false from tryAutoRefresh when no refresh token is available', async () => {
    service.removeTokens();
    const result = await service.tryAutoRefresh();
    expect(result).toBeFalse();
  });

  it('should return null for invalid token payload methods', () => {
    service.setTokens({ access_token: 'invalid.token', refresh_token: 'refresh-invalid' });
    expect(service.getUserId()).toBeNull();
    expect(service.getCompleteName()).toBeNull();
  });

  it('should clear session storage and reset token values', () => {
    const now = Math.floor(Date.now() / 1000);
    const token = createJwt({ exp: now + 3600, sub: 'user-4' });
    service.setTokens({ access_token: token, refresh_token: 'refresh-4' });

    service.removeTokens();

    expect(service.token()).toBeNull();
    expect(service.refresh()).toBeNull();
    expect(sessionStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('refresh_token')).toBeNull();
  });
});
