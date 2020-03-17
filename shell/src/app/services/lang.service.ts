import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ILanguageSettings {
  lang: string;
}

/**
 * Language service temporary to hold language settings
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private href = 'http://localhost:3333/language';
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
