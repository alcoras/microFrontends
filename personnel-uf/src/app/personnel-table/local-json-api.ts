import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPersonnel } from '../models/IPersonnel';

export interface IResponse {
  items: IPersonnel[];
  total: number;
}

export class ExampleHttpDatabase {
  href = 'http://localhost:3333/personnel';
  constructor(private httpClient: HttpClient) { }

  getAll(sort: string, order: string, page: number, pageSize: number): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}?_sort=${sort}&_order=${order}&_page=${page + 1}&_limit=${pageSize}`;
    return this.httpClient.get(reqUrl, {observe: 'response'});
  }

  delete(id: number): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}/${id}`;

    return this.httpClient.delete(reqUrl, {observe: 'response'});
  }

  update(data: IPersonnel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const reqUrl = `${this.href}/${data.PersonDataID}`;

    const body = JSON.stringify(data);

    return this.httpClient.patch(reqUrl, body, {headers, observe: 'response'});
  }

  create(data: IPersonnel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const reqUrl = `${this.href}`;

    const body = JSON.stringify(data);

    return this.httpClient.post(reqUrl, body, {headers, observe: 'response'});
  }
}
