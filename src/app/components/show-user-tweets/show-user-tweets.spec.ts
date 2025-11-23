import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowUserTweetsComponent } from './show-user-tweets';
import { Tweets } from '../../services/tweets';
import { MockTweetsService } from '../../shared/testing/mocks';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('ShowUserTweetsComponent', () => {
  let component: ShowUserTweetsComponent;
  let fixture: ComponentFixture<ShowUserTweetsComponent>;
  let tweetsService: MockTweetsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUserTweetsComponent, NoopAnimationsModule],
      providers: [
        { provide: Tweets, useClass: MockTweetsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'testuser' } },
            params: of({ username: 'testuser' }),
          } as unknown,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowUserTweetsComponent);
    component = fixture.componentInstance;
    tweetsService = TestBed.inject(Tweets) as unknown as MockTweetsService;
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tweets for user', () => {
    const mockTweets = [
      {
        tweetId: '1',
        message: 'Hello',
        username: 'testuser',
        time: 'now',
        likes: [],
        comments: [],
      },
    ];
    tweetsService.getTweetByUsername.and.returnValue(of(mockTweets));

    component.ngOnInit();

    expect(tweetsService.getTweetByUsername).toHaveBeenCalledWith('testuser');
    expect(component.tweets()).toEqual(mockTweets);
  });

  it('should navigate to login if no user', () => {
    (localStorage.getItem as unknown as jasmine.Spy).and.returnValue(null);
    (tweetsService.getTweetByUsername as unknown as jasmine.Spy).calls.reset();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(tweetsService.getTweetByUsername).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when loading tweets', () => {
    spyOn(console, 'error');
    tweetsService.getTweetByUsername.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalled();
  });

  it('should not load tweets if no username param', () => {
    (tweetsService.getTweetByUsername as unknown as jasmine.Spy).calls.reset();
    component.username.set('');
    component.loadUserTweets();
    expect(tweetsService.getTweetByUsername).not.toHaveBeenCalled();
  });

  it('should navigate back on goBack', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/show-users']);
  });
});


