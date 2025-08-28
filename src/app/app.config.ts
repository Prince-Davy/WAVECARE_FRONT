import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '@app/app.routes';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideTranslateService({
      lang: 'fr',
      fallbackLang: 'fr',
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    }),
    provideHttpClient(),
    provideAnimations()
  ]
};
