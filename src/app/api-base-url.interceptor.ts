// api-base-url.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * apiBaseUrlInterceptor
 * Prepends the configured API base URL to relative requests when present.
 * This interceptor skips absolute URLs and leaves them untouched.
 */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const cfg = inject(ConfigService);
  const baseUrl = cfg.apiBaseUrl ?? '';   // fallback si config pas prête

  if (!baseUrl) {
    return next(req);                     // pas de préfixe → OK en dev
  }

  const url = `${baseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  return next(req.clone({ url }));
};