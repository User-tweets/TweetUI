/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Tweets } from './tweets';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_CONFIG } from '../shared/api.config';

describe('Tweets', () => {
  let service: Tweets;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Tweets],
    });
    service = TestBed.inject(Tweets);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tweets', () => {
    const mockTweets = [{ tweetId: '1', message: 'test' }];

    service.getAllTweets().subscribe((tweets) => {
      expect(tweets.length).toBe(1);
      expect(tweets).toEqual(mockTweets as any);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTweets);
  });

  it('should get tweets by username', () => {
    const mockTweets = [{ tweetId: '1', message: 'test' }];
    const username = 'testuser';

    service.getTweetByUsername(username).subscribe((tweets) => {
      expect(tweets).toEqual(mockTweets as any);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTweets);
  });

  it('should save tweet', () => {
    const username = 'testuser';
    const tweet = { message: 'hello' };

    service.saveTweet(username, tweet).subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tweet);
    req.flush({});
  });

  it('should get username from local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    expect(service.getUsername()).toBe('testuser');
  });

  it('should like tweet', () => {
    const username = 'testuser';
    const id = '1';

    service.likeTweet(username, id).subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/like/${id}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get liked tweets', () => {
    const username = 'testuser';
    const likedIds = ['1', '2'];

    service.getLikedTweets(username).subscribe((ids) => {
      expect(ids).toEqual(likedIds);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/liked-tweets`);
    expect(req.request.method).toBe('GET');
    req.flush(likedIds);
  });

  it('should delete tweet', () => {
    const username = 'testuser';
    const id = '1';

    service.deleteTweet(id, username).subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update tweet', () => {
    const username = 'testuser';
    const id = '1';
    const body = { message: 'updated' };

    service.updateTweet(id, username, body).subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/update/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('should reply to tweet', () => {
    const username = 'testuser';
    const id = '1';
    const body = { comment: 'reply', username: 'replier' };

    service.replyTweet(id, username, body).subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/${username}/reply/${id}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });
});


