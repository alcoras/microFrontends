import { Component } from '@angular/core';
import { uEvent, uEventsIds, uParts } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';

class IncorrectEventName extends Error {
  public name = 'IncorrectEventName';
  public message = 'Incorrect event name was passed';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'menu';
  traceId = 1;

  sourceId: number = uParts.Menu;

  constructor(
    private eProxyService: EventProxyLibService,
  ) {
    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { console.log(this.title, value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );
  }

  menuClick(evt, eventName: number) {
    // create event
    this.eventButtonPressed(eventName);

    switch (eventName) {
      case uEventsIds.PerssonelButtonPressed:
        this.openTab(evt, 'personnel');
        break;
      case uEventsIds.OccupationButtonPressed:
        this.openTab(evt, 'occupations');
        break;
      case uEventsIds.OccupationNg9ButtonPressed:
        this.openTab(evt, 'occupationsNg9');
        break;
    }
  }

  eventButtonPressed(eventName: number) {
    const event = new uEvent();
    if (Object.values(uEventsIds).includes(eventName)) {
      event.EventId = eventName;
    } else {
      throw new IncorrectEventName();
    }

    event.SourceEventUniqueId = this.traceId++;
    event.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  openTab(evt, tabName: string) {
    let i: number;
    let tabcontent;
    let tablinks;

    tabcontent = document.getElementsByClassName('tabcontent');

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

}
