/**
 * Application Configuration Service Module
 * 
 * Loads and provides application configuration from external JSON file.
 * Manages API base URL and other application settings.
 * 
 * @module ConfigService
 * @see {@link ConfigService} for the service class
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
<<<<<<< Updated upstream
 * AppConfig
 * Minimal configuration object loaded from `/assets/config.json`.
=======
 * Application Configuration Interface
 * 
 * Defines the structure of the application configuration.
 * 
 * @interface AppConfig
 * @property {string} apiBaseUrl - The base URL for API calls (e.g., http://localhost:8080)
>>>>>>> Stashed changes
 */
export interface AppConfig {
  apiBaseUrl: string;
  strapiBaseUrl: string;
  strapiApiToken: string;
}

/**
<<<<<<< Updated upstream
 * ConfigService
 * Loads runtime configuration from `/assets/config.json` and exposes convenient accessors
 * (e.g. `apiBaseUrl`) used by interceptors and services.
=======
 * Configuration Service
 * 
 * Loads application configuration from `/assets/config.json` during startup.
 * Provides configuration values to other services and interceptors.
 * 
 * Configuration file structure:
 * ```json
 * {
 *   "apiBaseUrl": "https://api.example.com"
 * }
 * ```
 * 
 * @class ConfigService
 * @injectable
 * @see {@link apiBaseUrlInterceptor} for usage
>>>>>>> Stashed changes
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  /** HTTP client for loading configuration */
  private readonly http = inject(HttpClient);
  
  /** The loaded application configuration */
  private config!: AppConfig;

<<<<<<< Updated upstream
  /**
   * Loads the application configuration from the config.json asset file.
   * Falls back to a default development configuration if loading fails.
   * 
   * @returns Promise that resolves when configuration is loaded
   */
=======
  /**
   * Load application configuration from the config file
   * 
   * Asynchronously loads the configuration from `/assets/config.json`.
   * On error, falls back to development configuration (localhost:8080).
   * This method should be called during application initialization.
   * 
   * @async
   * @method load
   * @returns {Promise<void>} A promise that resolves when configuration is loaded
   * @throws {Error} Logs error to console but does not throw (uses fallback instead)
   * @example
   * // In app.config.ts:
   * export const appConfig: ApplicationConfig = {
   *   providers: [
   *     {
   *       provide: APP_INITIALIZER,
   *       useFactory: (config: ConfigService) => () => config.load(),
   *       deps: [ConfigService],
   *       multi: true
   *     }
   *   ]
   * };
   */
>>>>>>> Stashed changes
  async load(): Promise<void> {
    try {
      const cfg = await firstValueFrom(this.http.get<AppConfig>('/assets/config.json'));
      this.config = cfg;
    } catch (err) {
      console.error('Impossible de charger /assets/config.json', err);
      // Fallback facultatif pour le dev
      this.config = { apiBaseUrl: 'http://localhost:8080', strapiBaseUrl: 'http://localhost:1337', strapiApiToken: '' };
    }
  }

  /**
   * Get the API base URL from configuration
   * 
   * Returns the base URL to use for all API requests.
   * Defaults to empty string if not configured.
   * 
   * @method apiBaseUrl
   * @getter
   * @returns {string} The configured API base URL or empty string
   * @example
   * const baseUrl = this.configService.apiBaseUrl;
   * // Returns: 'https://api.example.com' or ''
   */
  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl ?? '';
  }

  get strapiBaseUrl(): string {
    return this.config?.strapiBaseUrl ?? '';
  }

  get strapiApiToken(): string {
    return this.config?.strapiApiToken ?? '';
  }
}