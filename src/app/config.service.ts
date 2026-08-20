import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * AppConfig
 * Minimal configuration object loaded from `/assets/config.json`.
 */
export interface AppConfig {
  apiBaseUrl: string;
  strapiBaseUrl: string;
  strapiApiToken: string;
}

/**
 * ConfigService
 * Loads runtime configuration from `/assets/config.json` and exposes convenient accessors
 * (e.g. `apiBaseUrl`) used by interceptors and services.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config!: AppConfig;

  /**
   * Loads the application configuration from the config.json asset file.
   * Falls back to a default development configuration if loading fails.
   * 
   * @returns Promise that resolves when configuration is loaded
   */
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