import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiBaseUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config!: AppConfig;

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