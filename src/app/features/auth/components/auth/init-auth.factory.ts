import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

export function initAuthFactory(
  auth: AuthTokenService,
  nav: NavigationService
): () => Promise<void> {
  return async () => {
    auth.initFromStorage();
    const ok = await auth.tryAutoRefresh();
    if (!ok) {
      auth.removeTokens();
      nav.navigateToLogin();
    }
  };
}
