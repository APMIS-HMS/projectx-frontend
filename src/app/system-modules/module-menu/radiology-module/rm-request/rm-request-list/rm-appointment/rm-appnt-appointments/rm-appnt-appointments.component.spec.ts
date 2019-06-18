import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAppntAppointmentsComponent } from './rm-appnt-appointments.component';

describe('RmAppntAppointmentsComponent', () => {
  let component: RmAppntAppointmentsComponent;
  let fixture: ComponentFixture<RmAppntAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAppntAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAppntAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
