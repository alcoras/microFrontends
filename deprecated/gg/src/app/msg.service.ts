import { Subject } from 'rxjs';

export class MessageService {
  public eventPreloaded = new Subject();

  public preloaded() {
    this.eventPreloaded.next();
  }
}
