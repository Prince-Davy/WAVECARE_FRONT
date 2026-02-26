// central auth configuration constants
export const REALM_URL = '/realms/Keycloak_WaveCare';
export const CLIENT_ID = 'wavecare_web';
export const TOKEN_ENDPOINT = `${REALM_URL}/protocol/openid-connect/token`;

export type StorageStrategy = 'session' | 'local';
export const STORAGE_STRATEGY: StorageStrategy = 'session';
