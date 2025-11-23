/* eslint-disable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService, MockRouter } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NavbarComponent', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on logout button click', () => {
    authService.isLoggedIn.set(true);
    fixture.detectChanges();

    component.logoutUser();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should display sign in link when not logged in', () => {
    authService.isLoggedIn.set(false);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    const linkTexts = Array.from(links).map((a: any) => a.textContent?.trim());
    expect(linkTexts).toContain('Sign In');
  });

  it('should display user menu when logged in', () => {
    authService.isLoggedIn.set(true);
    fixture.detectChanges();

    const menuTrigger = fixture.nativeElement.querySelector('button[mat-icon-button]');
    expect(menuTrigger).toBeTruthy();

    const links = fixture.nativeElement.querySelectorAll('a');
    const linkTexts = Array.from(links).map((a: any) => a.textContent?.trim());
    expect(linkTexts).not.toContain('Sign In');
  });
});


