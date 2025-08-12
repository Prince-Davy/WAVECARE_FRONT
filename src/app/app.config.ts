import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '@app/app.routes';

export const appConfig: ApplicationConfig = {
  // providers: [
  //   provideRouter(['/login']),
  //   provideHttpClient(
  //     withInterceptors([AuthInterceptor])
  //   )
  // ]
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      // withInterceptors([AuthInterceptor])
    ),
    provideAnimations()
  ]

  // providers: [
  //   provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay())]
};
