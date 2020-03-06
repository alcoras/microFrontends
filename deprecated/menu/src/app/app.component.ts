import { Component } from '@angular/core';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { EventButtonPressed } from '@uf-shared-events/index';
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

  placement: { [id: number]: string } = {};

  constructor(
    private eProxyService: EventProxyLibService,
  ) {
    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { console.log(this.title, value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.preparePlacements();
  }

  private preparePlacements() {
    this.placement[uEventsIds.PerssonelButtonPressed] = 'personnel';
    this.placement[uEventsIds.OccupationButtonPressed] = 'occupations';
    this.placement[uEventsIds.OccupationNg9ButtonPressed] = 'occupationsNg9';
  }

  private getElFromID(id: number): string {
    const elId = this.placement[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  menuClick(evt, eventName: number) {
    // create event
    this.eventButtonPressed(eventName);

    const elId = this.getElFromID(eventName);

    this.openTab(evt, elId);
  }

  eventButtonPressed(eventName: number) {
    const elId = this.getElFromID(eventName);

    const event = new EventButtonPressed(eventName, elId);

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
