import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../shared/api.config';
import { Tweet } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class Tweets {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  getAllTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(`${this.baseUrl}/all`);
  }

  getTweetByUsername(username: string): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(`${this.baseUrl}/${username}`);
  }

  saveTweet(username: string, tweet: Partial<Tweet>): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/${username}/add`, tweet);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  likeTweet(username: string, id: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/${username}/like/${id}`, null);
  }

  getLikedTweets(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${username}/liked-tweets`);
  }

  deleteTweet(id: string, username: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${username}/delete/${id}`);
  }

  updateTweet(id: string, username: string, body: { message: string }): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/${username}/update/${id}`, body);
  }

  replyTweet(
    id: string,
    username: string,
    body: { comment: string; username: string },
  ): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/${username}/reply/${id}`, body);
  }
}
