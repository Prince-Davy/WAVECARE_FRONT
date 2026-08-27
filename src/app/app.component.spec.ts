import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '@app/app.component';
import { AuthTokenService } from './features/auth/services/auth-token.service';
import { IdleTimeoutService } from './api/generated/idle-timeout/idle-timeout.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let authTokenServiceMock: {
    isAuthenticated: jasmine.Spy;
  };

  let idleTimeoutServiceMock: {
    startWatching: jasmine.Spy;
    stopWatching: jasmine.Spy;
  };

  beforeEach(async () => {
    authTokenServiceMock = {
      isAuthenticated: jasmine
        .createSpy('isAuthenticated')
        .and.returnValue(false),
    };

    idleTimeoutServiceMock = {
      startWatching: jasmine.createSpy('startWatching'),
      stopWatching: jasmine.createSpy('stopWatching'),
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        {
          provide: AuthTokenService,
          useValue: authTokenServiceMock,
        },
        {
          provide: IdleTimeoutService,
          useValue: idleTimeoutServiceMock,
        },
      ],
    })
      .overrideComponent(AppComponent, {
        set: {
          template: '<main data-testid="app-root-test"></main>',
        },
      })
      .compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('devrait créer l\'application', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('devrait afficher le conteneur principal', () => {
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-testid="app-root-test"]')).toBeTruthy();
  });

  it('should not use dashboard mode when the user is not authenticated', () => {
    createComponent();

    expect(component.dashboardMode()).toBeFalse();
  });

  it('should stop idle watching when user is not authenticated', () => {
    authTokenServiceMock.isAuthenticated.and.returnValue(false);

    createComponent();

    expect(idleTimeoutServiceMock.stopWatching).toHaveBeenCalled();
    expect(idleTimeoutServiceMock.startWatching).not.toHaveBeenCalled();
  });

  it('should start idle watching when user is authenticated on dashboard route', () => {
    authTokenServiceMock.isAuthenticated.and.returnValue(true);

    createComponent();

    expect(idleTimeoutServiceMock.startWatching).toHaveBeenCalled();
  });
});