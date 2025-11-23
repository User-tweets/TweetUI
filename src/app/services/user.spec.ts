/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { UserService } from './user';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_CONFIG } from '../shared/api.config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search user', () => {
    const username = 'test';
    const mockUsers = [{ username: 'testuser' }];

    service.searchUser(username).subscribe((users) => {
      expect(users).toEqual(mockUsers as any);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/user/search/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get all users', () => {
    const mockUsers = [{ username: 'user1' }, { username: 'user2' }];

    service.getAllUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers as any);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/user/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});


