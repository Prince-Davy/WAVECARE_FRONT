import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '@app/app.component';
import { AuthComponent } from '@app/features/auth/components/auth/auth.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        AuthComponent,
        BrowserAnimationsModule,
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
