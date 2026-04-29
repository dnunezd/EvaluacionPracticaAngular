import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail.component';
import { User } from '../user';

const mockUser = new User(1, 'alice', 'Alice Smith', 'alice@example.com', 'https://i.pravatar.cc/150?img=1', 'admin', 'New York', [101, 102]);

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('empty state', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show empty state when no user is selected', () => {
      expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
    });

    it('should not show detail content when no user is selected', () => {
      expect(fixture.nativeElement.querySelector('.detail-content')).toBeFalsy();
    });
  });

  describe('with user', () => {
    beforeEach(() => {
      component.user = mockUser;
      fixture.detectChanges();
    });

    it('should show detail content', () => {
      expect(fixture.nativeElement.querySelector('.detail-content')).toBeTruthy();
    });

    it('should not show empty state', () => {
      expect(fixture.nativeElement.querySelector('.empty-state')).toBeFalsy();
    });

    it('should display the user name', () => {
      const name: HTMLElement = fixture.nativeElement.querySelector('.detail-name');
      expect(name.textContent?.trim()).toBe(mockUser.name);
    });

    it('should display the username', () => {
      const username: HTMLElement = fixture.nativeElement.querySelector('.detail-username');
      expect(username.textContent?.trim()).toBe(mockUser.username);
    });

    it('should display the role badge with correct text and class', () => {
      const badge: HTMLElement = fixture.nativeElement.querySelector('.role-badge');
      expect(badge.textContent?.trim()).toBe(mockUser.role);
      expect(badge.classList).toContain(`role-badge--${mockUser.role}`);
    });

    it('should display location', () => {
      const values = fixture.nativeElement.querySelectorAll('.info-row__value');
      expect(values[0].textContent?.trim()).toBe(mockUser.location);
    });

    it('should display email', () => {
      const values = fixture.nativeElement.querySelectorAll('.info-row__value');
      expect(values[1].textContent?.trim()).toBe(mockUser.email);
    });

    it('should display repo count from repoIds', () => {
      const count: HTMLElement = fixture.nativeElement.querySelector('.repos-card__count');
      expect(count.textContent?.trim()).toBe(String(mockUser.repoIds.length));
    });
  });

  describe('closed event', () => {
    it('should emit closed when close button is clicked', () => {
      component.user = mockUser;
      fixture.detectChanges();
      spyOn(component.closed, 'emit');
      fixture.nativeElement.querySelector('.close-btn').click();
      expect(component.closed.emit).toHaveBeenCalled();
    });
  });
});
