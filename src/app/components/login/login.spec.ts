/* eslint-disable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService, MockRouter, MockSpinnerService } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: MockAuthService;
  let router: MockRouter;
  let spinner: MockSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    spyOn(router, 'navigate');
    spinner = TestBed.inject(NgxSpinnerService) as unknown as MockSpinnerService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.credentials.valid).toBeFalsy();
  });

  it('should have valid form when filled correctly', () => {
    component.credentials.controls['username'].setValue('test@example.com');
    component.credentials.controls['password'].setValue('password123');
    expect(component.credentials.valid).toBeTruthy();
  });

  it('should call getToken on submit', () => {
    component.credentials.controls['username'].setValue('test@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.onSubmit();
    expect(spinner.show).toHaveBeenCalled();
    expect(authService.getToken).toHaveBeenCalledWith({
      username: 'test@example.com',
      password: 'password123',
    });
  });

  it('should navigate to home on successful login', () => {
    component.credentials.controls['username'].setValue('test@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.onSubmit();
    expect(spinner.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login error', () => {
    authService.getToken.and.returnValue(throwError(() => new Error('Login failed')));
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.credentials.controls['username'].setValue('test@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.onSubmit();

    expect(spinner.hide).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });
});
