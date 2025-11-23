import { Component, inject, signal, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Tweets } from '../../services/tweets';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';
import { TweetCardComponent } from '../tweet-card/tweet-card';
import { Tweet } from '../../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, TweetCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private tweetsService = inject(Tweets);
  private userService = inject(UserService);
  private router = inject(Router);

  tweets = signal<Tweet[]>([]);
  currentUser = signal<string>('');
  newTweetContent = signal<string>('');

  ngOnInit() {
    const user = localStorage.getItem('username');
    if (user) {
      this.currentUser.set(user);
      this.loadTweets();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTweets() {
    this.tweetsService.getAllTweets().subscribe({
      next: (data) => {
        this.tweets.set(data || []);
      },
      error: (err: unknown) => console.error('Error loading tweets', err),
    });
  }

  postTweet() {
    if (!this.newTweetContent().trim()) return;

    const tweet: Partial<Tweet> = {
      message: this.newTweetContent(),
      username: this.currentUser(),
      likes: [],
      comments: [],
    };

    this.tweetsService.saveTweet(this.currentUser(), tweet).subscribe({
      next: () => {
        this.newTweetContent.set('');
        this.loadTweets();
      },
      error: (err: unknown) => console.error('Error posting tweet', err),
    });
  }
}
