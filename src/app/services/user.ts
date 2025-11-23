import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../shared/api.config';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Renamed to UserService for clarity, but keeping file name user.ts
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  searchUser(userName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/search/${userName}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/all`);
  }
}
