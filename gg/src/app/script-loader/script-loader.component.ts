import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-script-loader',
  template: ''
})
export class ScriptLoaderComponent implements AfterViewInit
{
  mainChannelEl: HTMLElement;

  constructor(private el: ElementRef)
  {
    console.log('INIT Script Loader');
    this.mainChannelEl = document.querySelector('main-channel');
  }

  ngAfterViewInit(): void
  {
    this.mainChannelEl.addEventListener(, this.attemptLoadScript.bind(this));
  }

  attemptLoadScript( event )
  {
    // check for event param, addr of script...
    this.loadScript( event['detail'][''] )
  }

  loadScript(scriptUrl:string) : Promise<any>
  {
    let scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(scriptUrl))
    {
      return new Promise(resolve =>
      {
        const scriptElement = document.createElement('script');
        scriptElement.src = scriptUrl;
        scriptElement.onload = resolve;
        document.body.appendChild(scriptElement);
      });
    }
  }

}
