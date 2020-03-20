import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOccupComponent } from './new-occup.component';

describe('NewOccupComponent', () => {
  let component: NewOccupComponent;
  let fixture: ComponentFixture<NewOccupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOccupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOccupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
