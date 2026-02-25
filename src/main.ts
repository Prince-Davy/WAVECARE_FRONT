// import compiler to support JIT (needed by HMR / dynamic component reloads)
import '@angular/compiler';
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app/app.routes';


registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    ...appConfig.providers
  ]
})
  .catch((err) => console.error(err));
