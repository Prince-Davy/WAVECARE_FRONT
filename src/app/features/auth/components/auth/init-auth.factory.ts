import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

export function initAuthFactory(
  auth: AuthTokenService
): () => Promise<void> {
  return async () => {
    auth.initFromStorage();
    const ok = await auth.tryAutoRefresh();
    // Nettoie les tokens expirés ; la redirection vers /login est gérée par authGuard
    if (!ok) {
      auth.removeTokens();
    }
  };
}
