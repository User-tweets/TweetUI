import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, BehaviorSubject, tap } from 'rxjs';

export interface Credentials {
  username: string;
  password: string;
}

export const environment = {
  production: false,
  apiUrl: 'https://tweet-mfrp.onrender.com'
};

@Injectable({
  providedIn: 'root',
})
export class Login_service {
  baseUrl = environment.apiUrl;
  cred: any;

  public isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(credentials: Credentials) {
    return this.http.post(`${this.baseUrl}/login`, credentials,
      {
        headers: { skip: 'true' },
        withCredentials: true
      })
      .pipe(
        tap(() => this.isLoggedInSubject.next(true)),
        catchError(error => {
          console.error('Error occurred while logging in:', error);
          return throwError(() => new Error('Login_service failed. Please try again.'));
        })
      );
  }

  isLoggedIn() {
    return this.hasToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  token() {
    return localStorage.getItem('token');
  }

  registerUser(credentials: any) {
    return this.http.post(`${this.baseUrl}/register`, credentials, { headers: { skip: "true" } });
  }

  forgotPassword(username: string, oldPassword: string, newPassword: string) {
    this.cred = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    return this.http.put(`${this.baseUrl}/${username}/forgot`, this.cred, { headers: { skip: "true" } });
  }
}
