import { environment } from '@environments/environment';

export const KEYCLOAK_REALM = 'Keycloak_WaveCare';

export const REALM_URL =
  `${environment.keycloakUrl}/realms/${KEYCLOAK_REALM}`;

// Token endpoint via backend (avoids CORS issues)
export const TOKEN_ENDPOINT = '/api/v1/auth/refresh';

export const CLIENT_ID = 'wavecare_web';

export type StorageStrategy = 'session' | 'local';

export const STORAGE_STRATEGY: StorageStrategy = 'session';
