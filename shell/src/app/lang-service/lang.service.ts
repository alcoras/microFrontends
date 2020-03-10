import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ILanguageSettings {
  lang: string;
}

export class LanguageService {
  href = 'http://localhost:3334/language';
  constructor(private httpClient: HttpClient) { }

  getLang(): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}`;
    return this.httpClient.get(reqUrl, {observe: 'response'});
  }

  setLang(newLang = 'en'): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = { lang: newLang };
    return this.httpClient.patch(reqUrl, body, {headers, observe: 'response'});
  }
}
