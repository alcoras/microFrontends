import { Subject } from 'rxjs';

export class MessageService {
  public eventPreloaded = new Subject();
  public eventLanguageLoaded = new Subject();

  public preloaded() {
    this.eventPreloaded.next();
  }

  public languageLoaded() {
    this.eventLanguageLoaded.next();
  }

}
