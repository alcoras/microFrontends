import { HttpResponse } from '@angular/common/http';
import { BackendToFrontendEvent } from "./BackendEvents/BackendToFrontendEvent";

export class ResponseStatus {
  public HttpResult: HttpResponse<BackendToFrontendEvent>;

  public Failed: boolean;

  public Error: string;
}
