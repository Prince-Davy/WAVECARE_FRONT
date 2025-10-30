import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TicketSearchBarComponent', () => {
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

  it('appelle removeAllKeywords() lorsque le bouton de réinitialisation est cliqué', () => {
    spyOn(component, 'removeAllKeywords');
    const button = fixture.debugElement.query(By.css('.reset-button')).nativeElement;
    button.click();
    expect(component.removeAllKeywords).toHaveBeenCalled();
  });
});
