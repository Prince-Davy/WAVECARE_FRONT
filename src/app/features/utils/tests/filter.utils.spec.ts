import { FilterUtils } from '../filter.utils';

describe('FilterUtils', () => {
  it('devrait retourner model.user.role.testRole', () => {
    expect(FilterUtils.getRoleLabel('testRole')).toBe(
      'model.user.role.testRole',
    );
  });

  it('devrait retourner model.user.status.testStatus', () => {
    expect(FilterUtils.getStatusLabel('testStatus')).toBe(
      'model.user.status.testStatus',
    );
  });

  it('devrait formater 01-01-2026 en 01/01/2026', () => {
    expect(FilterUtils.formatDate('01-01-2026')).toBe('01/01/2026');
  });

  it('devrait conserver un format dd/mm/yyyy déjà valide', () => {
    expect(FilterUtils.formatDate('31/12/2026')).toBe('31/12/2026');
  });

  it('devrait normaliser un format mm/dd/yyyy', () => {
    expect(FilterUtils.formatDate('12/31/2026')).toBe('31/12/2026');
  });

  it('devrait conserver une date avec slashs ambiguë', () => {
    expect(FilterUtils.formatDate('01/02/2026')).toBe('01/02/2026');
  });

  it('devrait conserver un format slash incomplet', () => {
    expect(FilterUtils.formatDate('01/02')).toBe('01/02');
  });

  it('devrait formater un objet Date', () => {
    const date = new Date('2026-01-01');

    expect(FilterUtils.formatDate(date)).toBe('01/01/2026');
  });

  it('devrait retourner une chaîne vide pour une date nulle', () => {
    expect(FilterUtils.formatDate(null)).toBe('');
  });

  it('devrait conserver une date avec année invalide', () => {
    expect(FilterUtils.formatDate('01-01-26')).toBe('01-01-26');
  });

  it('devrait formater une date textuelle valide', () => {
    expect(FilterUtils.formatDate('January 1, 2026')).toBe('01/01/2026');
  });

  it('devrait retourner la chaîne originale si la date est invalide', () => {
    expect(FilterUtils.formatDate('date-invalide')).toBe('date-invalide');
  });
});
