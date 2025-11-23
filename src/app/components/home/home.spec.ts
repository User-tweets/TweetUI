import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { UserService } from '../../services/user';
import { Tweets } from '../../services/tweets';
import { Router } from '@angular/router';
import { MockUserService, MockTweetsService, MockRouter } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let tweetsService: MockTweetsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, NoopAnimationsModule],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: Tweets, useClass: MockTweetsService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    tweetsService = TestBed.inject(Tweets) as unknown as MockTweetsService;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('testuser');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tweets on init', () => {
    const mockTweets = [
      { tweetId: '1', message: 'test', username: 'user', time: 'now', likes: [], comments: [] },
    ];
    tweetsService.getAllTweets.and.returnValue(of(mockTweets));

    component.ngOnInit();

    expect(tweetsService.getAllTweets).toHaveBeenCalled();
    expect(component.tweets()).toEqual(mockTweets);
  });

  it('should navigate to login if no user', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    (tweetsService.getAllTweets as jasmine.Spy).calls.reset();
    component.ngOnInit();
    expect(tweetsService.getAllTweets).not.toHaveBeenCalled();
    // Router navigation is handled by the mock/spy, we should verify it
    // But we need to spy on router.navigate in the test or use the mock
    // The mock is provided in beforeEach, let's verify it
    const router = TestBed.inject(Router);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when loading tweets', () => {
    spyOn(console, 'error');
    tweetsService.getAllTweets.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalled();
  });

  it('should post a tweet', () => {
    component.newTweetContent.set('Hello World');
    tweetsService.saveTweet.and.returnValue(of({}));
    tweetsService.getAllTweets.and.returnValue(of([])); // Refresh call

    component.postTweet();

    expect(tweetsService.saveTweet).toHaveBeenCalledWith('testuser', {
      message: 'Hello World',
      username: 'testuser',
      likes: [],
      comments: [],
    });
    expect(component.newTweetContent()).toBe('');
  });

  it('should not post empty tweet', () => {
    component.newTweetContent.set('');
    component.postTweet();
    expect(tweetsService.saveTweet).not.toHaveBeenCalled();
  });

  it('should handle error when posting tweet', () => {
    spyOn(console, 'error');
    component.newTweetContent.set('Hello World');
    tweetsService.saveTweet.and.returnValue(throwError(() => new Error('Error')));

    component.postTweet();

    expect(console.error).toHaveBeenCalled();
  });
});


