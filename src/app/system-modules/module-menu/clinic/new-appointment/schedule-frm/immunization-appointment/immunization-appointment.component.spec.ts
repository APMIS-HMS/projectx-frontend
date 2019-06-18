import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationAppointmentComponent } from './immunization-appointment.component';

describe('ImmunizationAppointmentComponent', () => {
  let component: ImmunizationAppointmentComponent;
  let fixture: ComponentFixture<ImmunizationAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmunizationAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmunizationAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
