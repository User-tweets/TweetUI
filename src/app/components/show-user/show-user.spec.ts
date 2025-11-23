import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowUser } from './show-user';
import { UserService } from '../../services/user';
import { MockUserService } from '../../shared/testing/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('ShowUserComponent', () => {
  let component: ShowUser;
  let fixture: ComponentFixture<ShowUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUser, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowUser);
    component = fixture.componentInstance;
    TestBed.inject(UserService);
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    fixture.detectChanges();
  });

  it('should navigate to user profile on viewProfile', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.viewProfile('testuser');
    expect(router.navigate).toHaveBeenCalledWith(['/show-users/testuser']);
  });

  it('should filter users based on search query', () => {
    const mockUsers = [
      { username: 'alice', email: '', firstName: '', lastName: '', password: '', number: '' },
      { username: 'bob', email: '', firstName: '', lastName: '', password: '', number: '' },
      { username: 'testuser', email: '', firstName: '', lastName: '', password: '', number: '' }, // Current user
    ];
    component.users.set(mockUsers);

    // Search for 'al'
    component.searchQuery.set('al');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].username).toBe('alice');

    // Search for 'o' (bob)
    component.searchQuery.set('o');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].username).toBe('bob');

    // Should exclude current user 'testuser' even if it matches query (e.g. 'test')
    component.searchQuery.set('test');
    expect(component.filteredUsers().length).toBe(0);
  });
});


