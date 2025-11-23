import { of } from 'rxjs';
import { signal } from '@angular/core';

export class MockAuthService {
  isLoggedIn = signal(false);
  getToken = jasmine
    .createSpy('getToken')
    .and.returnValue(of({ token: 'mock-token', username: 'mock-user' }));
  registerUser = jasmine.createSpy('registerUser').and.returnValue(of({}));
  forgotPassword = jasmine.createSpy('forgotPassword').and.returnValue(of({}));
  logout = jasmine.createSpy('logout');
}

export class MockUserService {
  getAllUsers = jasmine.createSpy('getAllUsers').and.returnValue(of([]));
}

export class MockTweetsService {
  getAllTweets = jasmine.createSpy('getAllTweets').and.returnValue(of([]));
  getTweetByUsername = jasmine.createSpy('getTweetByUsername').and.returnValue(of([]));
  saveTweet = jasmine.createSpy('saveTweet').and.returnValue(of({}));
  likeTweet = jasmine.createSpy('likeTweet').and.returnValue(of({}));
  replyTweet = jasmine.createSpy('replyTweet').and.returnValue(of({}));
  updateTweet = jasmine.createSpy('updateTweet').and.returnValue(of({}));
  deleteTweet = jasmine.createSpy('deleteTweet').and.returnValue(of({}));
}

export class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

export class MockSpinnerService {
  show = jasmine.createSpy('show');
  hide = jasmine.createSpy('hide');
  getSpinner = jasmine.createSpy('getSpinner').and.returnValue(of({}));
}
