import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { API_CONFIG } from '../shared/api.config';
import { LoginResponse, Credentials, DecodedToken, RegisterCredentials } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly TOKEN_KEY = 'token';

  // Signal-based state
  private _isLoggedIn = signal<boolean>(this.hasValidToken());

  // Publicly exposed signal (read-only)
  isLoggedIn = this._isLoggedIn.asReadonly();

  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (e) {
      console.error('❌ Error decoding token:', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    if (!decoded.exp) return false;

    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();
    return expirationDate <= now;
  }

  hasValidToken(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('username');
      }
      return false;
    }

    return true;
  }

  getToken(credentials: Credentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials, {
        headers: { skip: 'true' },
        withCredentials: true,
      })
      .pipe(
        tap(() => this._isLoggedIn.set(true)),
        catchError((error) => {
          console.error('Error occurred while logging in:', error);
          return throwError(() => new Error('Login failed. Please try again.'));
        }),
      );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('username');
    }
    this._isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  token(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  registerUser(credentials: RegisterCredentials): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/register`, credentials, { headers: { skip: 'true' } });
  }

  forgotPassword(username: string, oldPassword: string, newPassword: string): Observable<unknown> {
    const cred = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    return this.http.put(`${this.baseUrl}/${username}/forgot`, cred, { headers: { skip: 'true' } });
  }
}
