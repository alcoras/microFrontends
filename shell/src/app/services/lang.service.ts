/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ILanguageSettings {
  lang: string;
}

/**
 * Language service temporary to hold language settings (DEMO)
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private href = 'http://localhost:3333/language';

  /**
   *Creates an instance of LanguageService.
   * @param {HttpClient} httpClient angular http client
   * @memberof LanguageService
   */
  public constructor(private httpClient: HttpClient) { }

  public GetLang(): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}`;
    return this.httpClient.get(reqUrl, {observe: 'response'});
  }

  public SetLang(newLang = 'en'): Observable<HttpResponse<any>> {
    const reqUrl = `${this.href}`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = { lang: newLang };
    return this.httpClient.patch(reqUrl, body, {headers, observe: 'response'});
  }
}
