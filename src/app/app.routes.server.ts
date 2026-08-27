import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server-side rendering routes configuration.
 * Defines which routes should be prerendered and which should use server rendering.
 */
export const serverRoutes: ServerRoute[] = [
  {
    // Showcase est data-driven (Strapi) : pas de prérendu statique possible
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    // Pages nécessitant un appel API au chargement : rendu à la requête, pas de prérendu statique
    path: 'assistance',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tickets',
    renderMode: RenderMode.Server,
  },
  {
    path: 'users/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'patients',
    renderMode: RenderMode.Server,
  },
  {
    path: 'patients/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
