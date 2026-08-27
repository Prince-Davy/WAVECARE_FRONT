import { administratorGuard, radiologistGuard, radioOperatorGuard } from './features/auth/guards/role.guard';
import { homeRedirectGuard } from './guards/home-redirect.guard';
import {
  PATH_TO_ASSISTANCE,
  PATH_TO_FORGOT_PASSWORD,
  PATH_TO_LOGIN,
  PATH_TO_PATIENTS,
  PATH_TO_RESET_PASSWORD,
  PATH_TO_TICKETS,
  PATH_TO_USERS,
  routes,
} from './app.routes';

describe('app routes', () => {
  it('defines the auth and protected routes expected by the app', () => {
    expect(routes.find((route) => route.path === PATH_TO_LOGIN)).toBeTruthy();
    expect(routes.find((route) => route.path === PATH_TO_FORGOT_PASSWORD)).toBeTruthy();
    expect(routes.find((route) => route.path === PATH_TO_RESET_PASSWORD)).toBeTruthy();
    expect(routes.find((route) => route.path === PATH_TO_ASSISTANCE)).toBeTruthy();

    const ticketsRoute = routes.find((route) => route.path === PATH_TO_TICKETS);
    expect(ticketsRoute?.canActivate).toEqual([administratorGuard]);

    const usersRoute = routes.find((route) => route.path === PATH_TO_USERS);
    expect(usersRoute?.canActivate).toEqual([administratorGuard]);

    const trashRoute = usersRoute?.children?.find((route) => route.path === 'trash');
    expect(trashRoute?.loadComponent).toEqual(jasmine.any(Function));

    const patientsRoute = routes.find((route) => route.path === PATH_TO_PATIENTS);
    expect(patientsRoute?.canActivate).toEqual([radiologistGuard]);
  });

  it('defines the root redirect and catch-all fallback routes', () => {
    const rootRoute = routes.find((route) => route.path === '');
    expect(rootRoute?.canActivate).toEqual([homeRedirectGuard]);
    expect(rootRoute?.data).toEqual({ slug: '/' });
    expect(rootRoute?.loadComponent).toEqual(jasmine.any(Function));

    const notFoundRoute = routes.find((route) => route.path === '**');
    expect(notFoundRoute).toBeTruthy();
    expect(notFoundRoute?.loadComponent).toEqual(jasmine.any(Function));
  });

  it('exposes the role guard references used in the route config', () => {
    expect(radioOperatorGuard).toEqual(jasmine.any(Function));
    expect(administratorGuard).toEqual(jasmine.any(Function));
    expect(radiologistGuard).toEqual(jasmine.any(Function));
  });
});
