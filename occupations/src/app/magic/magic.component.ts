import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-magic',
  templateUrl: './magic.component.html',
  styleUrls: ['./magic.component.css']
})
export class MagicComponent implements OnInit {

  magic = "";
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.magic = "gg";
  }

}
