import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}
export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}
export class ExampleHttpDatabase {
  constructor(private httpClient: HttpClient) { }
  getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;
    return this.httpClient.get<GithubApi>(requestUrl);
  }
}
