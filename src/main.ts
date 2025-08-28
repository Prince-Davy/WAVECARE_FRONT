import { registerLocaleData } from '@angular/common';
import localFr from '@angular/common/locales/fr';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLocaleData(localFr)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
