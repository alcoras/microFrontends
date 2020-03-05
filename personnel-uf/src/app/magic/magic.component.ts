import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-magic',
  templateUrl: './magic.component.html',
  styleUrls: ['./magic.component.css']
})
export class MagicComponent implements OnInit {

  public counter = 0;

  constructor() { }

  ngOnInit() {
  }

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

}
