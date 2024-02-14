import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private cache: Map<string, any> = new Map();

  constructor(private httpClient: HttpClient) { }

  getUser(githubUsername: string): Observable<any> {
    const cacheKey = `user_${githubUsername}`;
    const cachedUser = this.cache.get(cacheKey);
    if (cachedUser) {
      return of(cachedUser);
    }
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`).pipe(
      tap(user => this.cache.set(cacheKey, user)),
      catchError(error => {
  
        return throwError(error);
      })
    );
  }

  getRepos(username: string, page: number, pageSize: number): Observable<any[]> {
    const cacheKey = `repos_${username}_${page}_${pageSize}`;
    const cachedRepos = this.cache.get(cacheKey);
    if (cachedRepos) {
      return of(cachedRepos);
    }
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', pageSize.toString());
    return this.httpClient.get<any[]>(`https://api.github.com/users/${username}/repos`, { params }).pipe(
      map(repos => {
        this.cache.set(cacheKey, repos);
        return repos;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
}
