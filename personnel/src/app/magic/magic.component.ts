import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-magic',
  templateUrl: './magic.component.html',
  styleUrls: ['./magic.component.css']
})
export class MagicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public counter : number = 0;

  increment(){
    this.counter += 1;
  }

  decrement(){
    this.counter -= 1;
  }

}
