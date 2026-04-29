import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RepositoryService } from './repository.service';
import { Repository } from './repository';
import { environment } from '../../environments/environment';

describe('RepositoryService', () => {
  let service: RepositoryService;
  let httpMock: HttpTestingController;

  const mockRepos: Repository[] = [
    new Repository(1, 'repo-one', 'First repo', 'TypeScript', 10, 1, '2025-01-01'),
    new Repository(2, 'repo-two', 'Second repo', 'Python', 5, 2, '2025-06-15'),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepositoryService]
    });
    service = TestBed.inject(RepositoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRepositories', () => {
    it('should make a GET request to the repositories endpoint', () => {
      service.getRepositories().subscribe();
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return the list of repositories', () => {
      let result: Repository[] = [];
      service.getRepositories().subscribe(repos => (result = repos));
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      req.flush(mockRepos);
      expect(result).toEqual(mockRepos);
    });

    it('should return an empty list when the response is empty', () => {
      let result: Repository[] = [mockRepos[0]];
      service.getRepositories().subscribe(repos => (result = repos));
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      req.flush([]);
      expect(result).toEqual([]);
    });
  });

  describe('getRepository', () => {
    it('should make a GET request to the repositories endpoint', () => {
      service.getRepository(1).subscribe();
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return the matching repository by id', () => {
      let result: Repository | undefined;
      service.getRepository(2).subscribe(r => (result = r));
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      req.flush(mockRepos);
      expect(result).toEqual(mockRepos[1]);
    });

    it('should return undefined when the id is not found', () => {
      let result: Repository | undefined = mockRepos[0];
      service.getRepository(999).subscribe(r => (result = r));
      const req = httpMock.expectOne(environment.baseUrl + 'repositories.json');
      req.flush(mockRepos);
      expect(result).toBeUndefined();
    });
  });
});
