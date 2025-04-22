import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';  // Importer AppComponent
import { AuthComponent } from './features/auth/pages/auth/auth.component';  // Importer AuthComponent
import { RouterTestingModule } from '@angular/router/testing'; // Si vous utilisez le routage
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importer le module de test HTTP
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Importer BrowserAnimationsModule

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        AuthComponent,
        RouterTestingModule,
        HttpClientTestingModule,  // Ajouter HttpClientTestingModule ici
        BrowserAnimationsModule,  // Ajouter BrowserAnimationsModule pour gérer les animations
      ],
    }).compileComponents();
  });

  it('devrait créer l\'application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('devrait afficher le composant app-auth', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-auth')).not.toBeNull();  // Vérifier que app-auth est rendu
  });
});
