import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['***REMOVED***']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler authService.***REMOVED*** lors de la soumission si le formulaire est valide', () => {
    const mockResponse = {
      access_token: 'fake-access-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'read write',
      role: 'ADMIN'
    };

    authServiceSpy.***REMOVED***.and.returnValue(of(mockResponse));

    component.***REMOVED***Form.setValue({ username: 'test', password: '1234' });
    component.onSubmit();

    const expectedLoginPayload = {
      username: 'test',
      password: '1234',
      grant_type: 'password',
      client_id: 'wavecare-client-id'
    };

    expect(authServiceSpy.***REMOVED***).toHaveBeenCalledWith(expectedLoginPayload);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('devrait afficher un message d’erreur en cas d’échec de connexion', () => {
    const errorResponse = new Error('Login failed');
    authServiceSpy.***REMOVED***.and.returnValue(throwError(() => errorResponse));

    component.***REMOVED***Form.setValue({ username: 'test', password: '1234' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
  });

  it('devrait être invalide lorsque le formulaire est vide', () => {
    component.onSubmit();
    expect(component.***REMOVED***Form.invalid).toBeTrue();
  });

  it('devrait être valide lorsque le formulaire est rempli', () => {
    component.***REMOVED***Form.setValue({ username: 'test', password: '1234' });
    expect(component.***REMOVED***Form.valid).toBeTrue();
  });
});
