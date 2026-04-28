import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * TODO: Documentation for serverRoutes (const)
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
