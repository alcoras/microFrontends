import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  mainChannelEl: HTMLElement;
  workingComp: HTMLElement;

  constructor(private el: ElementRef)
  {
    console.log('INIT OCCUPATIONS');
    this.mainChannelEl = document.querySelector('main-channel');
  }

  ngAfterViewInit()
  {

    this.mainChannelEl.addEventListener('event_2', this.onClick.bind(this));

  }

  onClick(event)
  {
    console.log(event);
    console.log('occupations: '+ event['type'] );

    var comp:HTMLElement = document.getElementById(event['detail']['comp_name']);

    //comp.innerHTML= "<team-occupations-2></team-occupations-2>"
  }


}
