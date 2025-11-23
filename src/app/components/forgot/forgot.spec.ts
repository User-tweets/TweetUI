import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Forgot } from './forgot';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService, MockRouter, MockSpinnerService } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Forgot Component', () => {
  let component: Forgot;
  let fixture: ComponentFixture<Forgot>;
  let authService: MockAuthService;
  let router: MockRouter;
  let spinner: MockSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forgot, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Forgot);
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

  it('should validate password mismatch', () => {
    component.credentials.controls['password'].setValue('password123');
    component.credentials.controls['confirmPassword'].setValue('password456');
    expect(component.passwordMismatch()).toBeTrue();
  });

  it('should call forgotPassword on submit when passwords match', () => {
    component.credentials.controls['userId'].setValue('test@example.com');
    component.credentials.controls['old_password'].setValue('oldpass');
    component.credentials.controls['password'].setValue('newpass');
    component.credentials.controls['confirmPassword'].setValue('newpass');
    component.credentials.controls['number'].setValue('1234567890');

    component.onSubmit();

    expect(spinner.show).toHaveBeenCalled();
    expect(authService.forgotPassword).toHaveBeenCalledWith(
      'test@example.com',
      'oldpass',
      'newpass',
    );
  });

  it('should alert on password mismatch submit', () => {
    spyOn(window, 'alert');
    component.credentials.controls['password'].setValue('newpass');
    component.credentials.controls['confirmPassword'].setValue('mismatch');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('password mismatch');
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });
});


