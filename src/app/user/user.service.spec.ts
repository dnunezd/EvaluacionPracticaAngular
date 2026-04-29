import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './user';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    new User(1, 'alice', 'Alice Smith', 'alice@example.com', 'https://i.pravatar.cc/150?img=1', 'admin', 'New York', [1, 2]),
    new User(2, 'bob', 'Bob Jones', 'bob@example.com', 'https://i.pravatar.cc/150?img=2', 'developer', 'Los Angeles', [3]),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should make a GET request to the users endpoint', () => {
      service.getUsers().subscribe();
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return the list of users', () => {
      let result: User[] = [];
      service.getUsers().subscribe(users => (result = users));
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      req.flush(mockUsers);
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty list when the response is empty', () => {
      let result: User[] = [mockUsers[0]];
      service.getUsers().subscribe(users => (result = users));
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      req.flush([]);
      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    it('should make a GET request to the users endpoint', () => {
      service.getUser(1).subscribe();
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return the matching user by id', () => {
      let result: User | undefined;
      service.getUser(2).subscribe(u => (result = u));
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      req.flush(mockUsers);
      expect(result).toEqual(mockUsers[1]);
    });

    it('should return undefined when the id is not found', () => {
      let result: User | undefined = mockUsers[0];
      service.getUser(999).subscribe(u => (result = u));
      const req = httpMock.expectOne(environment.baseUrl + 'users.json');
      req.flush(mockUsers);
      expect(result).toBeUndefined();
    });
  });
});
