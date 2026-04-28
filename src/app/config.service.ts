import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * AppConfig
 * Minimal configuration object loaded from `/assets/config.json`.
 */
export interface AppConfig {
/**
 * TODO: Documentation for apiBaseUrl (property)
 */
  apiBaseUrl: string;
}

/**
 * ConfigService
 * Loads runtime configuration and exposes convenient accessors
 * (e.g. `apiBaseUrl`) used by interceptors and services.
 */
/**
 * TODO: Documentation for ConfigService (class)
 */
/**
 * TODO: Documentation for ConfigService (class)
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config!: AppConfig;

/**
 * TODO: Documentation for load (method)
 * @returns TODO
 */
  async load(): Promise<void> {
    try {
      const cfg = await firstValueFrom(this.http.get<AppConfig>('/assets/config.json'));
      this.config = cfg;
    } catch (err) {
      console.error('Impossible de charger /assets/config.json', err);
      // Fallback facultatif pour le dev
      this.config = { apiBaseUrl: 'http://localhost:8080' };
    }
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl ?? '';
  }
}