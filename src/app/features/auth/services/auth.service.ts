import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse } from '@app/features/auth/models/auth.types';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';
import { AuthTokenService } from './auth-token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly AUTH_URL = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient, private tokenService: AuthTokenService) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const body = {
      username: credentials.username,
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
            this.tokenService.setToken(response.access_token);
          }
        }),
        timeout(10000)
      );
  }

  logout() {
    this.tokenService.removeToken();
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

  getUserInfoFromToken(token: string): Observable<{ id: string, email: string }> {
    console.log('🔄 Appel API getUserInfoFromToken avec token:', token);
    console.log('🔄 URL complète:', `${this.API_URL}/password-reset/reset-password?token=${token}`);

    return this.http.get<{ id: string, email: string }>(
      `${this.API_URL}/password-reset/reset-password?token=${token}`
    ).pipe(
      tap(response => console.log('✅ Réponse API getUserInfoFromToken:', response)),
      catchError(error => {
        console.error('❌ Erreur API getUserInfoFromToken:', error);
        return throwError(() => error);
      })
    );
  }

  updatePassword(userId: string, payload: { userName: string; newPassword: string }): Observable<any> {
    console.log('🔄 Appel updatePassword avec userId:', userId);
    console.log('🔄 Payload:', payload);
    console.log('🔄 URL complète:', `${this.API_URL}/user/${userId}/password`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });

    return this.http.put(`${this.API_URL}/user/${userId}/password`, payload, {
      headers: headers,
      responseType: 'text'
    }).pipe(
      tap(response => console.log('✅ Réponse updatePassword:', response)),
      catchError(error => {
        console.error('❌ Erreur updatePassword:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Error body:', error.error);
        return throwError(() => error);
      })
    );
  }

  deleteToken(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.delete(`${this.API_URL}/password-reset/supprimer-token`, {
      params: params,
      responseType: 'text'
    });
  }


  resetPasswordWithToken(token: string, newPassword: string): Observable<any> {
    console.log('🔄 Appel resetPasswordWithToken avec token:', token);

    return this.getUserInfoFromToken(token).pipe(
      switchMap(userInfo => {
        const payload = {
          userName: userInfo.email,
          newPassword: newPassword
        };

        console.log('🔄 Payload envoyé:', payload);
        console.log('🔄 URL complète:', `${this.API_URL}/user/${userInfo.id}/password`);

        return this.http.put(`${this.API_URL}/user/${userInfo.id}/password`, payload, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
      }),
      tap(response => console.log('✅ Réponse resetPasswordWithToken:', response)),
      catchError(error => {
        console.error('❌ Erreur resetPasswordWithToken:', error);
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
