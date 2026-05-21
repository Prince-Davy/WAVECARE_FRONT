import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Bootstrap function that initializes the Angular application on the server.
 * Configures Angular platform and providers for server-side rendering (SSR).
 * 
 * @param context - The bootstrap context provided by Angular's platform
 * @returns A promise that resolves when the application is fully bootstrapped
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, {...config, providers: [provideZoneChangeDetection(), ...config.providers]}, context);

export default bootstrap;
