import { Component, inject, signal, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Tweets } from '../../services/tweets';
import { TweetCardComponent } from '../tweet-card/tweet-card';
import { Tweet } from '../../shared/models';

@Component({
  selector: 'app-show-user-tweets',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TweetCardComponent],
  templateUrl: './show-user-tweets.html',
})
export class ShowUserTweetsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tweetsService = inject(Tweets);

  username = signal<string>('');
  tweets = signal<Tweet[]>([]);
  currentUser = signal<string>('');

  ngOnInit() {
    const loggedInUser = localStorage.getItem('username');
    if (!loggedInUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser.set(loggedInUser);

    this.route.params.subscribe((params) => {
      this.username.set(params['username']);
      this.loadUserTweets();
    });
  }

  loadUserTweets() {
    const targetUser = this.username();
    if (!targetUser) return;

    this.tweetsService.getTweetByUsername(targetUser).subscribe({
      next: (data: Tweet[]) => {
        this.tweets.set(data || []);
      },
      error: (err: unknown) => console.error('Error loading user tweets', err),
    });
  }

  goBack() {
    this.router.navigate(['/show-users']);
  }
}
