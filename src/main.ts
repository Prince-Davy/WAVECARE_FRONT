import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localFr from '@angular/common/locales/fr';

registerLocaleData(localFr)

bootstrapApplication(AppComponent, 
  {
    ...appConfig,
    providers: [
      (appConfig.providers || []),
      {provide: LOCALE_ID, useValue: 'fr-FR'}
    ]
  })
  .catch((err) => console.error(err));
