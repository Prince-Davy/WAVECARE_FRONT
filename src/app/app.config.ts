import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '@app/app.routes';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CustomTranslateLoader } from 'src/translate-loader';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigService } from './config.service';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { initAuthFactory } from './features/auth/components/auth/init-auth.factory';
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { NavigationService } from './features/navigation/services/navigation.service';
import { authInterceptor } from './features/auth/components/auth/auth.interceptor';
import { problemDetailInterceptor } from './core/interceptors/problem-detail.interceptor';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';

function initConfig() {
  const cfg = inject(ConfigService);
  return cfg.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    provideTranslateService({
      lang: 'fr',
      fallbackLang: 'fr',
      loader: provideTranslateLoader(CustomTranslateLoader)
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiBaseUrlInterceptor, authInterceptor, problemDetailInterceptor])
    ),
    provideTanStackQuery(new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          refetchOnWindowFocus: false,
        },
      },
    })),
    provideAppInitializer(initConfig),
    provideAppInitializer(() => initAuthFactory(inject(AuthTokenService), inject(NavigationService))()),
  ]
};
