import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '@app/app.routes';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CustomTranslateLoader } from 'src/translate-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideTranslateService({
      lang: 'fr',
      fallbackLang: 'fr',
      loader: provideTranslateLoader(CustomTranslateLoader)
    }),
    provideHttpClient(),
    provideAnimations()
  ]
};
