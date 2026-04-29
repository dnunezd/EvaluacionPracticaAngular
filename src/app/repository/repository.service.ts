import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private apiUrl = environment.baseUrl + 'repositories.json';

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(this.apiUrl);
  }

  getRepository(id: number): Observable<Repository> {
    return this.http.get<Repository[]>(this.apiUrl).pipe(
      map(repos => repos.find(r => r.id === id) as Repository)
    );
  }
}
