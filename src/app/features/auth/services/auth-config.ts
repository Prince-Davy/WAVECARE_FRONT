import { environment } from '@environments/environment';

/** Nom du realm Keycloak utilisé par WaveCare. */
export const KEYCLOAK_REALM = 'Keycloak_WaveCare';

/** URL complète du realm Keycloak. */
export const REALM_URL =
  `${environment.keycloakUrl}/realms/${KEYCLOAK_REALM}`;

/**
 * Endpoint backend utilisé pour renouveler les tokens d'authentification.
 *
 * Le passage par le backend permet notamment d'éviter les problèmes CORS
 * lors du renouvellement du token.
 */
export const TOKEN_ENDPOINT = '/api/v1/auth/refresh';

/** Identifiant du client WaveCare déclaré dans Keycloak. */
export const CLIENT_ID = 'wavecare_web';

/** Stratégie de stockage disponible pour les données d'authentification. */
export type StorageStrategy = 'session' | 'local';

/** Stratégie de stockage utilisée par défaut pour l'authentification. */
export const STORAGE_STRATEGY: StorageStrategy = 'session';