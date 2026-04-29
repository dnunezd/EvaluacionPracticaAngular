import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { Repository } from '../repository';

@Component({
  selector: 'app-repository-list',
  standalone: false,
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit {
  repos: Repository[] = [];
  page: number = 1;
  readonly itemsPerPage: number = 5;

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

  constructor(private repositoryService: RepositoryService) {}

  ngOnInit(): void {
    this.repositoryService.getRepositories().subscribe({
      next: (repos) => { this.repos = repos; },
      error: () => {}
    });
  }

  getLangStyle(lang: string): { [key: string]: string } {
    const s = this.langStyles[lang] || { bg: '#f3f4f6', text: '#374151' };
    return { 'background-color': s.bg, 'color': s.text };
  }

}
