/**
 * API Base URL Interceptor
 * 
 * HTTP interceptor that prepends the configured API base URL to all relative HTTP requests.
 * Skips requests that already have a protocol (http/https) or when no base URL is configured.
 * 
 * @module ApiBaseUrlInterceptor
 * @see {@link apiBaseUrlInterceptor} for the interceptor function
 */
// api-base-url.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

/**
<<<<<<< Updated upstream
 * apiBaseUrlInterceptor
 * Prepends the configured API base URL to relative requests when present.
 * This interceptor skips absolute URLs and leaves them untouched.
=======
 * HTTP Interceptor Function for API Base URL
 * 
 * Automatically prepends the configured API base URL to all relative HTTP requests.
 * - Skips requests that already have a full URL (http:// or https://)
 * - Uses ConfigService to get the base URL from configuration
 * - Falls back to no prefix if base URL is not configured (useful for development)
 * 
 * @function apiBaseUrlInterceptor
 * @type {HttpInterceptorFn}
 * @param {HttpRequest} req - The HTTP request
 * @param {HttpHandlerFn} next - The next handler in the chain
 * @returns {Observable<HttpEvent<unknown>>} The HTTP response
 * @example
 * // In providers:
 * {
 *   provide: HTTP_INTERCEPTORS,
 *   useValue: apiBaseUrlInterceptor,
 *   multi: true
 * }
>>>>>>> Stashed changes
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