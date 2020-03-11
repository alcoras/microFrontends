import { Subject } from 'rxjs';

/**
 * Message service used for internal communication
 * between script-loader and microfrontend manager
 */
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
