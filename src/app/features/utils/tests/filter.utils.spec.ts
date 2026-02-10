import { FilterUtils } from "../filter.utils";

describe('filterUtils (static)', () => {

  it('devrait retourner model.user.role.testRole', () => {
    let role = FilterUtils.getRoleLabel('testRole');
    expect(role).toBe('model.user.role.testRole');
  });

  it('devrait retourner model.user.status.testStatus', () => {
    let role = FilterUtils.getStatusLabel('testStatus');
    expect(role).toBe('model.user.status.testStatus');
  });

  it ('devrait formater 01-01-2026 en 01/01/2026', () => {
    let dateString = FilterUtils.formatDate('01-01-2026');
    expect(dateString).toBe('01/01/2026');
  });

  it ('devrait formater la date du 1er janvier 2026 en 01/01/2026', () => {
    const date = new Date('2026-01-01')
    let dateString = FilterUtils.formatDate(date);
    expect(dateString).toBe('01/01/2026');
  });
});
