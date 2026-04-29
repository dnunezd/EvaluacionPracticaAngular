import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../repository.service';
import { UserService } from '../../user/user.service';
import { Repository } from '../repository';
import { User } from '../../user/user';

@Component({
  selector: 'app-repository-detail',
  standalone: false,
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.css']
})
export class RepositoryDetailComponent implements OnInit {
  repo: Repository | null = null;
  owner: User | null = null;

  private readonly langStyles: { [key: string]: { bg: string; text: string } } = {
    'TypeScript': { bg: '#dbeafe', text: '#1e40af' },
    'JavaScript': { bg: '#fef9c3', text: '#854d0e' },
    'Python':     { bg: '#dcfce7', text: '#166534' },
    'Java':       { bg: '#ffedd5', text: '#9a3412' },
    'Go':         { bg: '#ccfbf1', text: '#0f766e' },
    'Rust':       { bg: '#fde8d8', text: '#92400e' },
    'HTML':       { bg: '#fee2e2', text: '#991b1b' },
    'CSS':        { bg: '#ede9fe', text: '#5b21b6' },
    'Kotlin':     { bg: '#ede9fe', text: '#7c3aed' },
    'Swift':      { bg: '#ffe4e6', text: '#9f1239' },
    'C++':        { bg: '#e0e7ff', text: '#3730a3' },
    'C#':         { bg: '#d1fae5', text: '#065f46' },
    'Shell':      { bg: '#f0fdf4', text: '#15803d' },
    'YAML':       { bg: '#fef3c7', text: '#92400e' },
    'Ruby':       { bg: '#fee2e2', text: '#991b1b' },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.repositoryService.getRepository(id).subscribe({
      next: (repo) => {
        this.repo = repo;
        this.userService.getUser(repo.ownerId).subscribe({
          next: (user) => { this.owner = user; },
          error: () => {}
        });
      },
      error: () => {}
    });
  }

  getLangStyle(lang: string): { [key: string]: string } {
    const s = this.langStyles[lang] || { bg: '#f3f4f6', text: '#374151' };
    return { 'background-color': s.bg, 'color': s.text };
  }

  goBack(): void {
    this.router.navigate(['/repositories']);
  }
}
