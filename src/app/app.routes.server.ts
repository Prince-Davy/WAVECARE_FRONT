import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server-side rendering routes configuration.
 * Defines which routes should be prerendered and which should use server rendering.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'patients/:id',
    renderMode: RenderMode.Server,
  }
];
