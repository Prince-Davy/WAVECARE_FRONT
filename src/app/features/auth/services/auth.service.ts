import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse } from '@app/features/auth/models/auth.interface';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenService: AuthTokenService) { }

  ***REMOVED***(credentials: LoginCredentials): Observable<LoginResponse> {
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
      `api/***REMOVED***`,
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
    const params = new HttpParams().set('email', email);

    return this.http.post(`api/password-reset/request`, undefined, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      },),
      params: params,
      responseType: 'text',
    });
  }

  readToken(token: string): Observable<{ id: string, email: string }> {
    const params = new HttpParams().set('token', token);

    return this.http.get<{ id: string, email: string }>(
      `api/password-reset/token`, { params }
    );
  }

  updatePassword(token: string | null, userId: string, payload: { userName: string; newPassword: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });

    const params = new HttpParams().set('token', token!);

    return this.http.put(`api/user/${userId}/password`, payload, {
      headers: headers,
      params: params,
      responseType: 'text'
    })
  }

  deleteToken(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.delete(`api/password-reset/token`, {
      params: params,
      responseType: 'text'
    });
  }
}
