import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService, MockRouter, MockSpinnerService } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { throwError } from 'rxjs';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authService: MockAuthService;
  let router: MockRouter;
  let spinner: MockSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
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

  it('should call registerUser on submit', () => {
    component.credentials.controls['firstName'].setValue('John');
    component.credentials.controls['lastName'].setValue('Doe');
    component.credentials.controls['username'].setValue('john@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.credentials.controls['number'].setValue('1234567890');

    component.onSubmit();

    expect(spinner.show).toHaveBeenCalled();
    expect(authService.registerUser).toHaveBeenCalled();
  });

  it('should navigate to login on successful registration', () => {
    component.credentials.controls['firstName'].setValue('John');
    component.credentials.controls['lastName'].setValue('Doe');
    component.credentials.controls['username'].setValue('john@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.credentials.controls['number'].setValue('1234567890');

    component.onSubmit();

    expect(spinner.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', () => {
    authService.registerUser.and.returnValue(throwError(() => new Error('Registration failed')));
    spyOn(console, 'error');

    component.credentials.controls['firstName'].setValue('John');
    component.credentials.controls['lastName'].setValue('Doe');
    component.credentials.controls['username'].setValue('john@example.com');
    component.credentials.controls['password'].setValue('password123');
    component.credentials.controls['number'].setValue('1234567890');

    component.onSubmit();

    expect(spinner.hide).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});


