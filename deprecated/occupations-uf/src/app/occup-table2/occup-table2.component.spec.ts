import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupTable2Component } from './occup-table2.component';

describe('OccupTable2Component', () => {
  let component: OccupTable2Component;
  let fixture: ComponentFixture<OccupTable2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupTable2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
