import { AfterViewInit, Component, ElementRef, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'gg';

  constructor(
    public el: ElementRef,
    public renderer: Renderer2)
    {
      console.log('INIT');
    }

  /*@HostListener('event_1', ['$event.target'])
  onEvent_1(event)
  {
    console.log('main-channel: event_1\n');
    //console.log(event);
  }*/
}
