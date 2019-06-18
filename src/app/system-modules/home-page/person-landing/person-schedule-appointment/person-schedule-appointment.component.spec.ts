import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonScheduleAppointmentComponent } from './person-schedule-appointment.component';

describe('PersonScheduleAppointmentComponent', () => {
  let component: PersonScheduleAppointmentComponent;
  let fixture: ComponentFixture<PersonScheduleAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonScheduleAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonScheduleAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
