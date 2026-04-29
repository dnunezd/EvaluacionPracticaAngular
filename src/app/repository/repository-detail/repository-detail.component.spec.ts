import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RepositoryDetailComponent } from './repository-detail.component';
import { RepositoryService } from '../repository.service';
import { UserService } from '../../user/user.service';
import { Repository } from '../repository';
import { User } from '../../user/user';

const mockRepo = new Repository(110, 'repo-110', 'GraphQL API', 'TypeScript', 80, 7, '2025-02-15');
const mockUser = new User(7, 'user7', 'User Seven', 'user7@mail.com', 'https://i.pravatar.cc/150?img=7', 'developer', 'Manizales', [110, 111]);

describe('RepositoryDetailComponent', () => {
  let component: RepositoryDetailComponent;
  let fixture: ComponentFixture<RepositoryDetailComponent>;
  let repositoryServiceSpy: jasmine.SpyObj<RepositoryService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    repositoryServiceSpy = jasmine.createSpyObj('RepositoryService', ['getRepository']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    repositoryServiceSpy.getRepository.and.returnValue(of(mockRepo));
    userServiceSpy.getUser.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      declarations: [RepositoryDetailComponent],
      imports: [CommonModule, RouterTestingModule],
      providers: [
        { provide: RepositoryService, useValue: repositoryServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '110' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getRepository with the id from the route', () => {
      fixture.detectChanges();
      expect(repositoryServiceSpy.getRepository).toHaveBeenCalledOnceWith(110);
    });

    it('should set the repo property', () => {
      fixture.detectChanges();
      expect(component.repo).toEqual(mockRepo);
    });

    it('should call getUser with the ownerId of the loaded repo', () => {
      fixture.detectChanges();
      expect(userServiceSpy.getUser).toHaveBeenCalledOnceWith(mockRepo.ownerId);
    });

    it('should set the owner property', () => {
      fixture.detectChanges();
      expect(component.owner).toEqual(mockUser);
    });

    it('should leave owner null when getUser returns undefined', () => {
      userServiceSpy.getUser.and.returnValue(of(undefined as unknown as User));
      fixture.detectChanges();
      expect(component.owner).toBeUndefined();
    });
  });

  describe('goBack', () => {
    it('should navigate to /repositories', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledOnceWith(['/repositories']);
    });
  });

  describe('getLangStyle', () => {
    const cases: [string, string, string][] = [
      ['TypeScript', '#dbeafe', '#1e40af'],
      ['JavaScript', '#fef9c3', '#854d0e'],
      ['Python',     '#dcfce7', '#166534'],
      ['Java',       '#ffedd5', '#9a3412'],
      ['Go',         '#ccfbf1', '#0f766e'],
      ['Rust',       '#fde8d8', '#92400e'],
      ['HTML',       '#fee2e2', '#991b1b'],
      ['CSS',        '#ede9fe', '#5b21b6'],
      ['Kotlin',     '#ede9fe', '#7c3aed'],
      ['Swift',      '#ffe4e6', '#9f1239'],
      ['C++',        '#e0e7ff', '#3730a3'],
      ['C#',         '#d1fae5', '#065f46'],
      ['Shell',      '#f0fdf4', '#15803d'],
      ['YAML',       '#fef3c7', '#92400e'],
      ['Ruby',       '#fee2e2', '#991b1b'],
    ];

    cases.forEach(([lang, expectedBg, expectedColor]) => {
      it(`should return the correct colors for ${lang}`, () => {
        const style = component.getLangStyle(lang);
        expect(style['background-color']).toBe(expectedBg);
        expect(style['color']).toBe(expectedColor);
      });
    });

    it('should return default colors for an unknown language', () => {
      const style = component.getLangStyle('COBOL');
      expect(style['background-color']).toBe('#f3f4f6');
      expect(style['color']).toBe('#374151');
    });
  });

  describe('template — with repo and owner loaded', () => {
    beforeEach(() => fixture.detectChanges());

    it('should render the back button', () => {
      expect(fixture.nativeElement.querySelector('.btn-back')).toBeTruthy();
    });

    it('should call goBack when the back button is clicked', () => {
      spyOn(component, 'goBack');
      fixture.nativeElement.querySelector('.btn-back').click();
      expect(component.goBack).toHaveBeenCalled();
    });

    it('should display the repo name in the h1', () => {
      const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
      expect(h1.textContent?.trim()).toBe(mockRepo.name);
    });

    it('should display the repo description', () => {
      const desc: HTMLElement = fixture.nativeElement.querySelector('.repo-desc');
      expect(desc.textContent?.trim()).toBe(mockRepo.description);
    });

    it('should display the language badge with the correct text', () => {
      const badge: HTMLElement = fixture.nativeElement.querySelector('.lang-badge');
      expect(badge.textContent?.trim()).toBe(mockRepo.language);
    });

    it('should display the stars count', () => {
      const statValues: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.fs-5');
      const starsCell = statValues[0];
      expect(starsCell.textContent?.trim()).toBe(String(mockRepo.stars));
    });

    it('should render the owner card', () => {
      expect(fixture.nativeElement.querySelector('.owner-name')).toBeTruthy();
    });

    it('should display the owner name', () => {
      const ownerName: HTMLElement = fixture.nativeElement.querySelector('.owner-name');
      expect(ownerName.textContent?.trim()).toBe(mockUser.name);
    });

    it('should display the owner username', () => {
      const ownerUsername: HTMLElement = fixture.nativeElement.querySelector('.owner-username');
      expect(ownerUsername.textContent?.trim()).toBe(mockUser.username);
    });

    it('should render the owner avatar with the correct src', () => {
      const avatar: HTMLImageElement = fixture.nativeElement.querySelector('.owner-avatar');
      expect(avatar.src).toBe(mockUser.avatarUrl);
    });
  });

  describe('template — owner not available', () => {
    beforeEach(() => {
      userServiceSpy.getUser.and.returnValue(of(undefined as unknown as User));
      fixture.detectChanges();
    });

    it('should not render the owner card', () => {
      expect(fixture.nativeElement.querySelector('.owner-name')).toBeNull();
    });
  });
});
