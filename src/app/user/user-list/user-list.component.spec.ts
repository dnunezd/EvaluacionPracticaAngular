import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { User } from '../user';

const mockUsers: User[] = [
  new User(1, 'alice', 'Alice Smith', 'alice@example.com', 'https://i.pravatar.cc/150?img=1', 'admin', 'New York', [1, 2]),
  new User(2, 'bob', 'Bob Jones', 'bob@example.com', 'https://i.pravatar.cc/150?img=2', 'developer', 'Los Angeles', [3]),
];

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [CommonModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getUsers once', () => {
      fixture.detectChanges();
      expect(userServiceSpy.getUsers).toHaveBeenCalledOnceWith();
    });

    it('should populate the users list', () => {
      fixture.detectChanges();
      expect(component.users).toEqual(mockUsers);
    });

    it('should start with no selected user', () => {
      fixture.detectChanges();
      expect(component.selectedUser).toBeNull();
    });
  });

  describe('selectUser', () => {
    it('should select a user', () => {
      component.selectUser(mockUsers[0]);
      expect(component.selectedUser).toEqual(mockUsers[0]);
    });

    it('should switch selection to a different user', () => {
      component.selectUser(mockUsers[0]);
      component.selectUser(mockUsers[1]);
      expect(component.selectedUser).toEqual(mockUsers[1]);
    });

    it('should not deselect if the same user is clicked again', () => {
      component.selectUser(mockUsers[0]);
      component.selectUser(mockUsers[0]);
      expect(component.selectedUser).toEqual(mockUsers[0]);
    });
  });

  describe('template', () => {
    beforeEach(() => fixture.detectChanges());

    it('should render one item per user', () => {
      const items = fixture.nativeElement.querySelectorAll('.user-item');
      expect(items.length).toBe(mockUsers.length);
    });

    it('should display the user count in the badge', () => {
      const badge: HTMLElement = fixture.nativeElement.querySelector('.count-badge');
      expect(badge.textContent?.trim()).toBe(String(mockUsers.length));
    });

    it('should display each username', () => {
      const usernames = fixture.nativeElement.querySelectorAll('.user-item__username');
      expect(usernames[0].textContent?.trim()).toBe(mockUsers[0].username);
      expect(usernames[1].textContent?.trim()).toBe(mockUsers[1].username);
    });

    it('should display the role badge for each user', () => {
      const badges = fixture.nativeElement.querySelectorAll('.role-badge');
      expect(badges[0].textContent?.trim()).toBe(mockUsers[0].role);
      expect(badges[1].textContent?.trim()).toBe(mockUsers[1].role);
    });

    it('should apply the role-specific class to each badge', () => {
      const badges = fixture.nativeElement.querySelectorAll('.role-badge');
      expect(badges[0].classList).toContain(`role-badge--${mockUsers[0].role}`);
      expect(badges[1].classList).toContain(`role-badge--${mockUsers[1].role}`);
    });

    it('should not apply selected class when no user is selected', () => {
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.user-item');
      items.forEach(item => expect(item.classList).not.toContain('user-item--selected'));
    });

    it('should apply selected class only to the selected user', () => {
      component.selectUser(mockUsers[0]);
      fixture.detectChanges();
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.user-item');
      expect(items[0].classList).toContain('user-item--selected');
      expect(items[1].classList).not.toContain('user-item--selected');
    });

    it('should move selected class when a different user is clicked', () => {
      component.selectUser(mockUsers[0]);
      fixture.detectChanges();
      component.selectUser(mockUsers[1]);
      fixture.detectChanges();
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.user-item');
      expect(items[0].classList).not.toContain('user-item--selected');
      expect(items[1].classList).toContain('user-item--selected');
    });

    it('should keep selected class when the same user is clicked again', () => {
      component.selectUser(mockUsers[0]);
      fixture.detectChanges();
      component.selectUser(mockUsers[0]);
      fixture.detectChanges();
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.user-item');
      expect(items[0].classList).toContain('user-item--selected');
    });
  });
});
