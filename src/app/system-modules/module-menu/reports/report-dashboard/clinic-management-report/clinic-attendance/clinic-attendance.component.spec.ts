import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicAttendanceComponent } from './clinic-attendance.component';

describe('ClinicAttendanceComponent', () => {
  let component: ClinicAttendanceComponent;
  let fixture: ComponentFixture<ClinicAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
