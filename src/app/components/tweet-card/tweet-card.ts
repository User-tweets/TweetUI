import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Tweets } from '../../services/tweets';
import { Tweet } from '../../shared/models';

@Component({
  selector: 'app-tweet-card',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './tweet-card.html',
})
export class TweetCardComponent {
  @Input({ required: true }) tweet!: Tweet;
  @Input({ required: true }) currentUser!: string;
  @Output() refreshNeeded = new EventEmitter<void>();

  private tweetsService = inject(Tweets);

  // Inline Interaction State
  isEditing = signal<boolean>(false);
  showComments = signal<boolean>(false);
  editContent = signal<string>('');
  replyContent = signal<string>('');

  // Like
  like() {
    this.tweetsService.likeTweet(this.currentUser, this.tweet.tweetId).subscribe({
      next: () => this.refreshNeeded.emit(),
      error: (err: unknown) => console.error('Error liking tweet', err),
    });
  }

  // Delete
  delete() {
    if (confirm('Are you sure you want to delete this tweet?')) {
      this.tweetsService.deleteTweet(this.tweet.tweetId, this.tweet.username).subscribe({
        next: () => this.refreshNeeded.emit(),
        error: (err: unknown) => console.error('Error deleting tweet', err),
      });
    }
  }

  // Reply/Comments
  toggleComments() {
    this.showComments.update((v) => !v);
  }

  submitReply() {
    if (!this.replyContent().trim()) return;

    this.tweetsService
      .replyTweet(this.tweet.tweetId, this.tweet.username, {
        comment: this.replyContent(),
        username: this.currentUser,
      })
      .subscribe({
        next: () => {
          this.replyContent.set('');
          this.refreshNeeded.emit();
          // Keep comments open to see the new reply
          this.showComments.set(true);
        },
        error: (err: unknown) => console.error('Error replying to tweet', err),
      });
  }

  // Edit
  startEdit() {
    this.isEditing.set(true);
    this.editContent.set(this.tweet.message);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editContent.set('');
  }

  submitEdit() {
    if (!this.editContent().trim()) return;

    this.tweetsService
      .updateTweet(this.tweet.tweetId, this.tweet.username, { message: this.editContent() })
      .subscribe({
        next: () => {
          this.isEditing.set(false);
          this.editContent.set('');
          this.refreshNeeded.emit();
        },
        error: (err: unknown) => console.error('Error updating tweet', err),
      });
  }
}
