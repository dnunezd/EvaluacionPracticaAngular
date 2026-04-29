import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { RepositoryListComponent } from './repository-list.component';
import { RepositoryService } from '../repository.service';
import { Repository } from '../repository';

const mockRepos: Repository[] = [
  new Repository(1, 'repo-one', 'First repo', 'TypeScript', 10, 1, '2025-01-01'),
  new Repository(2, 'repo-two', 'Second repo', 'Python', 5, 2, '2025-06-15'),
];

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;
  let repositoryServiceSpy: jasmine.SpyObj<RepositoryService>;

  beforeEach(async () => {
    repositoryServiceSpy = jasmine.createSpyObj('RepositoryService', ['getRepositories']);
    repositoryServiceSpy.getRepositories.and.returnValue(of(mockRepos));

    await TestBed.configureTestingModule({
      declarations: [RepositoryListComponent],
      imports: [CommonModule, RouterTestingModule, NgxPaginationModule],
      providers: [{ provide: RepositoryService, useValue: repositoryServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getRepositories once', () => {
      fixture.detectChanges();
      expect(repositoryServiceSpy.getRepositories).toHaveBeenCalledOnceWith();
    });

    it('should populate the repos list', () => {
      fixture.detectChanges();
      expect(component.repos).toEqual(mockRepos);
    });

    it('should start on page 1', () => {
      fixture.detectChanges();
      expect(component.page).toBe(1);
    });
  });

  describe('getLangStyle', () => {
    it('should return the correct colors for a known language', () => {
      const style = component.getLangStyle('TypeScript');
      expect(style['background-color']).toBe('#dbeafe');
      expect(style['color']).toBe('#1e40af');
    });

    it('should return default colors for an unknown language', () => {
      const style = component.getLangStyle('COBOL');
      expect(style['background-color']).toBe('#f3f4f6');
      expect(style['color']).toBe('#374151');
    });
  });

  describe('template', () => {
    beforeEach(() => fixture.detectChanges());

    it('should render one card per repository', () => {
      const cards = fixture.nativeElement.querySelectorAll('.repo-card');
      expect(cards.length).toBe(mockRepos.length);
    });

    it('should display the repository count in the badge', () => {
      const badge: HTMLElement = fixture.nativeElement.querySelector('.count-badge');
      expect(badge.textContent).toContain(String(mockRepos.length));
    });

    it('should display each repository name', () => {
      const names = fixture.nativeElement.querySelectorAll('.repo-name');
      expect(names[0].textContent?.trim()).toBe(mockRepos[0].name);
      expect(names[1].textContent?.trim()).toBe(mockRepos[1].name);
    });

    it('should display the language badge for each repository', () => {
      const badges = fixture.nativeElement.querySelectorAll('.lang-badge');
      expect(badges[0].textContent?.trim()).toBe(mockRepos[0].language);
      expect(badges[1].textContent?.trim()).toBe(mockRepos[1].language);
    });

    it('should display the stars for each repository', () => {
      const stars = fixture.nativeElement.querySelectorAll('.repo-stars');
      expect(stars[0].textContent).toContain(String(mockRepos[0].stars));
      expect(stars[1].textContent).toContain(String(mockRepos[1].stars));
    });
  });
});
