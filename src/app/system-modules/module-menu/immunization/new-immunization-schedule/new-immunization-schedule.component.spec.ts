import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImmunizationScheduleComponent } from './new-immunization-schedule.component';

describe('NewImmunizationScheduleComponent', () => {
  let component: NewImmunizationScheduleComponent;
  let fixture: ComponentFixture<NewImmunizationScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewImmunizationScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewImmunizationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
