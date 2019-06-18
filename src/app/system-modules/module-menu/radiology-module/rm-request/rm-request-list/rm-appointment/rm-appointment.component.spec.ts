import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAppointmentComponent } from './rm-appointment.component';

describe('RmAppointmentComponent', () => {
  let component: RmAppointmentComponent;
  let fixture: ComponentFixture<RmAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
