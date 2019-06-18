import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCheckInComponent } from './lab-check-in.component';

describe('LabCheckInComponent', () => {
  let component: LabCheckInComponent;
  let fixture: ComponentFixture<LabCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
