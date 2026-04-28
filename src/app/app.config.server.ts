import { provideServerRendering, withRoutes } from '@angular/ssr';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { appConfig } from '@app/app.config';
import { serverRoutes } from '@app/app.routes.server';

/**
 * serverConfig
 * Server-side specific ApplicationConfig used for SSR (routes, providers).
 */
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))]
};

/**
 * config
 * Merged application configuration for server rendering.
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
