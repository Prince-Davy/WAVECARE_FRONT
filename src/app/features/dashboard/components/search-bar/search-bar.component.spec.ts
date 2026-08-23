import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchBarComponent,
        FormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ajoute un mot-clé lorsque addKeyword() est appelée', () => {
    component.inputValue = 'test';
    component.addKeyword();
    expect(component.listKeywords).toContain('test');
  });

  it('n\'ajoute pas de doublons', () => {
    component.listKeywords = ['test'];
    component.inputValue = 'test';
    component.addKeyword();
    expect(component.listKeywords.length).toBe(1);
  });

  it('n\'ajoute pas de mots-clés vides ou contenant uniquement des espaces', () => {
    component.inputValue = '   ';
    component.addKeyword();
    expect(component.listKeywords.length).toBe(0);
  });

  it('supprime un mot-clé lorsque removeKeyword() est appelée', () => {
    component.listKeywords = ['test', 'example'];
    component.removeKeyword('test');
    expect(component.listKeywords).not.toContain('test');
    expect(component.listKeywords.length).toBe(1);
  });

  it('supprime un role lorsque removeRoleFilter() est appelée', () => {
    component.advancedFilters.role = ['testRole', 'exampleRole'];
    component.removeRoleFilter('testRole');
    expect(component.advancedFilters.role).not.toContain('testRole');
    expect(component.advancedFilters.role?.length).toBe(1);
  });

  it('supprime un statut lorsque removeStatusFilter() est appelée', () => {
    component.advancedFilters.status = ['testStatus', 'exampleStatus'];
    component.removeStatusFilter('testStatus');
    expect(component.advancedFilters.status).not.toContain('testStatus');
    expect(component.advancedFilters.status?.length).toBe(1);
  });

  it('supprime la date lorsque removeDateFilter() est appelée', () => {
    component.advancedFilters.createdDate = '01/01/2026'
    component.removeDateFilter();
    expect(component.advancedFilters.createdDate).toBe('');
  });

  it('émet keywordsChanged lorsqu\'un mot-clé est ajouté', () => {
    spyOn(component.keywordsChanged, 'emit');
    component.inputValue = 'test';
    component.addKeyword();
    expect(component.keywordsChanged.emit).toHaveBeenCalledWith(['test']);
  });

  it('émet keywordsChanged lorsqu\'un mot-clé est supprimé', () => {
    spyOn(component.keywordsChanged, 'emit');
    component.listKeywords = ['test'];
    component.removeKeyword('test');
    expect(component.keywordsChanged.emit).toHaveBeenCalledWith([]);
  });

  it('réinitialise tous les mots-clés lorsque removeAllKeywords() est appelée', () => {
    component.listKeywords = ['test', 'example'];
    component.removeAllKeywords();
    expect(component.listKeywords.length).toBe(0);
  });

  it('réinitialise tous les filtres avancés lorsque removeAllKeywords() est appelée', () => {
    component.advancedFilters = {
      role: ['testRole'],
      status: ['testStatus'],
      createdDate: '01/01/2026'
    }
    component.removeAllKeywords();
    expect(component.advancedFilters.role?.length).toBe(0);
    expect(component.advancedFilters.status?.length).toBe(0);
    expect(component.advancedFilters.createdDate).toBe('');
  });

  it('émet keywordsChanged lorsque tous les mots-clés sont réinitialisés', () => {
    spyOn(component.keywordsChanged, 'emit');
    component.listKeywords = ['test', 'example'];
    component.removeAllKeywords();
    expect(component.keywordsChanged.emit).toHaveBeenCalledWith([]);
  });

  it('affiche le bon nombre de mots-clés dans le template', () => {
    component.listKeywords = ['test', 'example'];
    fixture.detectChanges();
    const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
    expect(chips.length).toBe(2);
  });

  it('appelle addKeyword() lorsque le bouton de recherche est cliqué', () => {
    spyOn(component, 'addKeyword');
    const button = fixture.debugElement.query(By.css('.search-button')).nativeElement;
    button.click();
    expect(component.addKeyword).toHaveBeenCalled();
  });

  it('expose le bouton de reset quand des filtres ou mots-clés existent', () => {
    component.listKeywords = ['test'];
    expect(component.showResetButton).toBeTrue();

    component.listKeywords = [];
    component.advancedFilters = { role: ['ADMIN'] } as any;
    expect(component.showResetButton).toBeTrue();

    component.advancedFilters = { createdDate: '01/01/2026' } as any;
    expect(component.showResetButton).toBeTrue();

    component.listKeywords = [];
    component.advancedFilters = {} as any;
    expect(component.showResetButton).toBeFalse();
  });

  it('réinitialise l’état et émet les événements attendus au reset', () => {
    spyOn(component.resetRequested, 'emit');
    spyOn(component.keywordsChanged, 'emit');
    component.inputValue = ' test ';
    component.listKeywords = ['sample'];
    component.advancedFilters = { role: ['ADMIN'], status: ['OK'], createdDate: '01/01/2026' } as any;

    component.onReset();

    expect(component.inputValue).toBe('');
    expect(component.listKeywords).toEqual([]);
    expect(component.isFiltersOpen).toBeFalse();
    expect(component.resetRequested.emit).toHaveBeenCalled();
    expect(component.keywordsChanged.emit).toHaveBeenCalledWith([]);
  });

  it('fonctionne en mode simple avec recherche trimée et sortie de données', () => {
    fixture.componentRef.setInput('mode', 'simple');
    component.inputValue = '  Test keyword  ';
    spyOn(component.simpleSearch, 'emit');

    component.onSearch();

    expect(component.listKeywords).toEqual(['test keyword']);
    expect(component.inputValue).toBe('');
    expect(component.simpleSearch.emit).toHaveBeenCalledWith('Test keyword');
  });

  it('toggleFilters inverse l’état du panneau', () => {
    component.isFiltersOpen = false;
    component.toggleFilters();
    expect(component.isFiltersOpen).toBeTrue();

    component.toggleFilters();
    expect(component.isFiltersOpen).toBeFalse();
  });

  it('propagate filters change and date reset events', () => {
    spyOn(component.filtersChanged, 'emit');

    component.onAdvancedFiltersChanged({ role: ['ADMIN'] } as any);
    expect(component.advancedFilters.role).toEqual(['ADMIN']);
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({ role: ['ADMIN'] });

    component.onAdvancedFiltersReset();
    expect(component.advancedFilters).toEqual({});
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({});
  });

  it('formate les libellés et les dates via les utilitaires', () => {
    expect(component.getRoleLabel('ADMIN')).toBeTruthy();
    expect(component.getStatusLabel('ACTIVE')).toBeTruthy();
    expect(component.formatDate('2024-01-02')).toContain('2024');
  });
});
