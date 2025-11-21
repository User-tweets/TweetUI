import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Tweets {
  constructor(private http: HttpClient) { }

  baseUrl = "https://tweet-mfrp.onrender.com";

  getAllTweets() {

    return this.http.get(`${this.baseUrl}/all`);
  }
  getTweetByUsername(username: string) {

    return this.http.get(`${this.baseUrl}/${username}`)
  }

  saveTweet(username: string, tweet: any) {

    return this.http.post(`${this.baseUrl}/${username}/add`, tweet);
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  likeTweet(username: string, id: string) {

    return this.http.post(`${this.baseUrl}/${username}/like/${id}`, null);
  }

  getLikedTweets(username: string) {
    return this.http.get<string[]>(`${this.baseUrl}/${username}/liked-tweets`);
  }

  deleteTweet(id: string, username: string) {

    return this.http.delete(`${this.baseUrl}/${username}/delete/${id}`);
  }

  updateTweet(id: string, username: string, body: any) {

    return this.http.put(`${this.baseUrl}/${username}/update/${id}`, body);
  }
  replyTweet(id: string, username: string, body: any) {

    return this.http.post(`${this.baseUrl}/${username}/reply/${id}`, body);
  }
}
