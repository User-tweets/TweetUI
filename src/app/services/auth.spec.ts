import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { API_CONFIG } from '../shared/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Login', () => {
    it('should login successfully and set token', () => {
      const mockResponse = { token: 'mock-token', username: 'testuser' };
      const credentials = { username: 'testuser', password: 'password' };

      service.getToken(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(service.isLoggedIn()).toBeTrue();
      });

      const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const credentials = { username: 'testuser', password: 'wrongpassword' };

      service.getToken(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('Login failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/login`);
      req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Token Management', () => {
    it('should return true for hasValidToken when token exists and is not expired', () => {
      // Create a token that expires in the future
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = btoa(JSON.stringify({ exp: futureTime }));
      const token = `header.${payload}.signature`;

      spyOn(localStorage, 'getItem').and.returnValue(token);

      expect(service.hasValidToken()).toBeTrue();
    });

    it('should return false for hasValidToken when token is expired', () => {
      // Create a token that expired in the past
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = btoa(JSON.stringify({ exp: pastTime }));
      const token = `header.${payload}.signature`;

      spyOn(localStorage, 'getItem').and.returnValue(token);
      spyOn(localStorage, 'removeItem');

      expect(service.hasValidToken()).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    });

    it('should return false for hasValidToken when no token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.hasValidToken()).toBeFalse();
    });

    it('should return null for token() when no token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.token()).toBeNull();
    });

    it('should return token for token() when token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue('some-token');
      expect(service.token()).toBe('some-token');
    });
  });

  describe('Logout', () => {
    it('should logout, clear storage and navigate to home', () => {
      spyOn(localStorage, 'removeItem');

      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('username');
      expect(service.isLoggedIn()).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Other Operations', () => {
    it('should register user', () => {
      const credentials = {
        username: 'newuser',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        contactNumber: '1234567890',
      };

      service.registerUser(credentials).subscribe();

      const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/register`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('should handle forgot password', () => {
      service.forgotPassword('user', 'old', 'new').subscribe();

      const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/user/forgot`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });
});


