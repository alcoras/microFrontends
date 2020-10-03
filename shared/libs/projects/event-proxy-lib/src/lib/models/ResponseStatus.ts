import { HttpResponse } from '@angular/common/http';

export class ResponseStatus {
  public HttpResult: HttpResponse<any>;

  public Failed: boolean;

  public Error: string;
}
