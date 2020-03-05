import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupTableComponent } from './occup-table.component';

describe('OccupTableComponent', () => {
  let component: OccupTableComponent;
  let fixture: ComponentFixture<OccupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
