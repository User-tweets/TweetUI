import { TestBed } from '@angular/core/testing';

import { Tweets } from './tweets';

describe('Tweets', () => {
  let service: Tweets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tweets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
