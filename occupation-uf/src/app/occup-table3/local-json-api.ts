import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IOccupation {
  id: string;
  occupation: string;
  created_at: string;
}

export interface IResponse {
  items: IOccupation[];
  total: number;
}

export class ExampleHttpDatabase {
  href = 'http://localhost:3333/occupations';
  constructor(private httpClient: HttpClient) { }
  getOccupations(sort: string, order: string, page: number, pageSize: number): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}?_sort=${sort}&_order=${order}&_page=${page + 1}&_limit=${pageSize}`;
    return this.httpClient.get(reqUrl, {observe: 'response'});
  }

  delOccupation(id: number): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}/${id}`;

    return this.httpClient.delete(reqUrl, {observe: 'response'});
  }

  updateOccupation(data: IOccupation) {
    const reqUrl = `${this.href}/${data.id}`;

    const body = { occupation: data.occupation, created_at: data.created_at };

    return this.httpClient.patch(reqUrl, body, {observe: 'response'});
  }

  createNewEntry(data: IOccupation) {
    const reqUrl = `${this.href}`;

    const body = { occupation: data.occupation, created_at: (new Date(data.created_at)).toISOString() };

    return this.httpClient.post(reqUrl, body, {observe: 'response'});
  }
}
