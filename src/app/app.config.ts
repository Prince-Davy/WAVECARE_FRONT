import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '@app/app.routes';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CustomTranslateLoader } from 'src/translate-loader';
import { ConfigService } from './config.service';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';



function initConfig() {
  const cfg = inject(ConfigService);
  return cfg.load();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideTranslateService({
      lang: 'fr',
      fallbackLang: 'fr',
      loader: provideTranslateLoader(CustomTranslateLoader)
    }),
    provideHttpClient(
      withFetch(), 
      withInterceptors([apiBaseUrlInterceptor])
    ),
    provideAnimations(),
    provideAppInitializer(initConfig)
  ]
};
