import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupTable3Component } from './occup-table3.component';

describe('OccupTable3Component', () => {
  let component: OccupTable3Component;
  let fixture: ComponentFixture<OccupTable3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupTable3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupTable3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
