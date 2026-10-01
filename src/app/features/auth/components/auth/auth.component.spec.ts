import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { AuthComponent } from '@app/features/auth/components/auth/auth.component';
import { AuthService } from '@app/features/auth/services/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler authService.login lors de la soumission si le formulaire est valide', () => {
    const mockResponse = {
      access_token: 'fake-access-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'read write',
      role: 'ADMIN',
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ username: 'test', password: '1234' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
    username: 'test',
    password: '1234',
    });
  });

  it('devrait être invalide lorsque le formulaire est vide', () => {
    component.onSubmit();
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('devrait être valide lorsque le formulaire est rempli', () => {
    component.loginForm.setValue({ username: 'test', password: '1234' });
    expect(component.loginForm.valid).toBeTrue();
  });
});