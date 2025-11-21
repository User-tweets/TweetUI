import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {
  baseUrl = "https://tweet-mfrp.onrender.com";

  constructor(private http: HttpClient) { }

  searchUser(userName: string) {

    return this.http.get(`${this.baseUrl}/user/search/${userName}`);
  }
  getAllUsers() {

    return this.http.get(`${this.baseUrl}/user/all`);
  }
}
