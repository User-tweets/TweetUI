import { TestBed } from '@angular/core/testing';

import { Login_service } from './login_service';

describe('Login_service', () => {
  let service: Login_service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Login_service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
