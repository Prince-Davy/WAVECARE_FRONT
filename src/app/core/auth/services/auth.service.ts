import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { LoginResponse, LoginCredentials } from '../models/auth.types';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8080/api';
    private readonly AUTH_URL = 'http://localhost:8080/api/***REMOVED***';
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    private platformId = inject(PLATFORM_ID);

    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
      if (isPlatformBrowser(this.platformId)) {
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
              this.currentUserSubject.next(JSON.parse(storedUser));

              /* Problème de suppresion de token avec l'appel de log out dans le constructeur
              if (!this.isTokenValid()) {
                  this.logout();
             } */
          }
      }
  }
  

    setStoredUser(tokenResponse: any) {
        localStorage.setItem('access_token', tokenResponse.access_token);
        localStorage.setItem('refresh_token', tokenResponse.refresh_token);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getCurrentRole(): string | undefined {

        const token = this.getToken();
        if (token) {
            const decodedToken = this.decodeToken(token);
            return decodedToken.realm_access?.roles[0];
        }
        return undefined;
    }

    private decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    refreshToken(): Observable<LoginResponse> {
      const refreshToken = this.currentUserSubject.value?.refresh_token;
      if (!refreshToken) {
          return throwError(() => new Error('No refresh token available'));
      }

      const body = new URLSearchParams();
      body.set('grant_type', 'refresh_token');
      body.set('refresh_token', refreshToken);
      body.set('client_id', 'wavecare_web');

      return this.http.post<LoginResponse>(this.AUTH_URL, body.toString(), {
          headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded'
          })
      }).pipe(
          tap(response => {
              this.setStoredUser(response);
              this.currentUserSubject.next(response);
          })
      );
  }

  isTokenValid(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser?.access_token) {
        return false;
    }

    try {
        const decodedToken = this.decodeToken(currentUser.access_token);
        if (!decodedToken) {
            return false;
        }


        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {

            this.setStoredUser(null);
            this.currentUserSubject.next(null);
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

  ***REMOVED***(credentials: LoginCredentials): Observable<LoginResponse> {


    const body = {
        username : credentials.username,
        password: credentials.password
    }

    const httpOptions = {
      headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
  };
    return this.http.post<LoginResponse>(
      this.AUTH_URL,
      body,
      httpOptions)
        .pipe(
            tap(response => {
                if (response.access_token) {
                    this.setStoredUser(response);
                    this.currentUserSubject.next(response);
                }
            }),

            catchError(error => {
                this.currentUserSubject.next(null);
                return throwError(() => error);
            }),

            timeout(10000)
        );
}

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.currentUserSubject.next(null);
    }

    forgotPassword(email: string): Observable<any> {
    const body = new HttpParams().set('email', email);

    return this.http.post(`${this.API_URL}/password-reset/request`, body.toString(), {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        responseType: 'text'
    }).pipe(
        catchError(error => {
            console.error('Erreur lors de la demande de réinitialisation:', error);
            return throwError(() => error);
        })
    );
}

    // Ajoutez aussi cette méthode pour la réinitialisation complète du mot de passe
    resetPassword(token: string, newPassword: string): Observable<any> {
        const body = new HttpParams()
            .set('token', token)
            .set('newPassword', newPassword);

        return this.http.post(`${this.API_URL}/password-reset/confirm`, body.toString(), {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            responseType: 'text'
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la réinitialisation du mot de passe:', error);
                return throwError(() => error);
            })
        );
    }



    checkSuperAdminAccess(): Observable<string> {
        return this.http.get<string>(`${this.API_URL}/super-admin`);
    }

    checkMedicalAdminAccess(): Observable<string> {
        return this.http.get<string>(`${this.API_URL}/admin-med`);
    }

    checkHealthProfessionalAccess(): Observable<string> {
        return this.http.get<string>(`${this.API_URL}/profsante`);
    }
}