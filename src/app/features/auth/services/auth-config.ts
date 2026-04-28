// central auth configuration constants
/**
 * TODO: Documentation for REALM_URL (const)
 */
export const REALM_URL = '/realms/Keycloak_WaveCare';
/**
 * TODO: Documentation for CLIENT_ID (const)
 */
export const CLIENT_ID = 'wavecare_web';
/**
 * TODO: Documentation for TOKEN_ENDPOINT (const)
 */
export const TOKEN_ENDPOINT = `${REALM_URL}/protocol/openid-connect/token`;

/**
 * TODO: Documentation for StorageStrategy (type)
 */
export type StorageStrategy = 'session' | 'local';
/**
 * TODO: Documentation for STORAGE_STRATEGY (const)
 */
export const STORAGE_STRATEGY: StorageStrategy = 'session';
