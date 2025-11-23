/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TweetCardComponent } from './tweet-card';
import { Tweets } from '../../services/tweets';
import { MockTweetsService } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Tweet } from '../../shared/models';

describe('TweetCardComponent', () => {
  let component: TweetCardComponent;
  let fixture: ComponentFixture<TweetCardComponent>;
  let tweetsService: MockTweetsService;

  const mockTweet: Tweet = {
    tweetId: '1',
    username: 'testuser',
    message: 'Hello',
    time: 'now',
    likes: [],
    comments: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TweetCardComponent, NoopAnimationsModule],
      providers: [{ provide: Tweets, useClass: MockTweetsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TweetCardComponent);
    component = fixture.componentInstance;
    component.tweet = mockTweet;
    component.currentUser = 'currentuser';
    tweetsService = TestBed.inject(Tweets) as unknown as MockTweetsService;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display tweet content', () => {
    fixture.detectChanges();
    const messageEl = fixture.nativeElement.querySelector('p');
    expect(messageEl.textContent).toContain('Hello');
  });

  it('should call likeTweet on like button click', () => {
    fixture.detectChanges();
    tweetsService.likeTweet.and.returnValue(of({}));
    component.like();
    expect(tweetsService.likeTweet).toHaveBeenCalledWith('currentuser', '1');
  });

  it('should emit refreshNeeded on like success', () => {
    fixture.detectChanges();
    tweetsService.likeTweet.and.returnValue(of({}));
    spyOn(component.refreshNeeded, 'emit');
    component.like();
    expect(component.refreshNeeded.emit).toHaveBeenCalled();
  });

  it('should handle error on like', () => {
    fixture.detectChanges();
    spyOn(console, 'error');
    tweetsService.likeTweet.and.returnValue(throwError(() => new Error('Error')));
    component.like();
    expect(console.error).toHaveBeenCalled();
  });

  it('should show delete button only for tweet owner', () => {
    component.currentUser = 'testuser'; // Owner
    fixture.detectChanges();
    const menuButton = fixture.nativeElement.querySelector(
      'button[mat-icon-button], button.text-slate-400',
    );
    expect(menuButton).toBeTruthy();
  });

  it('should not show delete button for non-owner', () => {
    component.currentUser = 'otheruser';
    fixture.detectChanges();
    const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon'));
    const moreIcon = icons.find((icon: any) => icon.textContent === 'more_horiz');
    expect(moreIcon).toBeFalsy();
  });

  it('should call deleteTweet on delete action', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    tweetsService.deleteTweet.and.returnValue(of({}));
    spyOn(component.refreshNeeded, 'emit');

    component.delete();

    expect(tweetsService.deleteTweet).toHaveBeenCalledWith('1', 'testuser');
    expect(component.refreshNeeded.emit).toHaveBeenCalled();
  });

  it('should not delete if confirmation is cancelled', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(false);
    component.delete();
    expect(tweetsService.deleteTweet).not.toHaveBeenCalled();
  });

  it('should handle error on delete', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
    tweetsService.deleteTweet.and.returnValue(throwError(() => new Error('Error')));
    component.delete();
    expect(console.error).toHaveBeenCalled();
  });

  it('should toggle comments visibility', () => {
    fixture.detectChanges();
    expect(component.showComments()).toBeFalse();
    component.toggleComments();
    expect(component.showComments()).toBeTrue();
  });

  it('should submit reply', () => {
    fixture.detectChanges();
    component.replyContent.set('Nice tweet');
    tweetsService.replyTweet.and.returnValue(of({}));
    spyOn(component.refreshNeeded, 'emit');

    component.submitReply();

    expect(tweetsService.replyTweet).toHaveBeenCalled();
    expect(component.replyContent()).toBe('');
    expect(component.refreshNeeded.emit).toHaveBeenCalled();
    expect(component.showComments()).toBeTrue();
  });

  it('should not submit reply with empty content', () => {
    fixture.detectChanges();
    component.replyContent.set('');
    component.submitReply();
    expect(tweetsService.replyTweet).not.toHaveBeenCalled();
  });

  it('should handle error on reply', () => {
    fixture.detectChanges();
    component.replyContent.set('Nice tweet');
    spyOn(console, 'error');
    tweetsService.replyTweet.and.returnValue(throwError(() => new Error('Error')));
    component.submitReply();
    expect(console.error).toHaveBeenCalled();
  });

  // Edit tests
  it('should start edit mode', () => {
    fixture.detectChanges();
    component.startEdit();
    expect(component.isEditing()).toBeTrue();
    expect(component.editContent()).toBe('Hello');
  });

  it('should cancel edit mode', () => {
    fixture.detectChanges();
    component.startEdit();
    component.cancelEdit();
    expect(component.isEditing()).toBeFalse();
    expect(component.editContent()).toBe('');
  });

  it('should submit edit', () => {
    fixture.detectChanges();
    component.startEdit();
    component.editContent.set('Updated');
    tweetsService.updateTweet.and.returnValue(of({}));
    spyOn(component.refreshNeeded, 'emit');

    component.submitEdit();

    expect(tweetsService.updateTweet).toHaveBeenCalledWith('1', 'testuser', { message: 'Updated' });
    expect(component.isEditing()).toBeFalse();
    expect(component.editContent()).toBe('');
    expect(component.refreshNeeded.emit).toHaveBeenCalled();
  });

  it('should not submit empty edit', () => {
    fixture.detectChanges();
    component.startEdit();
    component.editContent.set('');
    component.submitEdit();
    expect(tweetsService.updateTweet).not.toHaveBeenCalled();
  });

  it('should handle error on edit', () => {
    fixture.detectChanges();
    component.startEdit();
    component.editContent.set('Updated');
    spyOn(console, 'error');
    tweetsService.updateTweet.and.returnValue(throwError(() => new Error('Error')));
    component.submitEdit();
    expect(console.error).toHaveBeenCalled();
  });
});


