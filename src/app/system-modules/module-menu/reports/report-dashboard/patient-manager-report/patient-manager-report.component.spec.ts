import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientManagerReportComponent } from './patient-manager-report.component';

describe('PatientManagerReportComponent', () => {
  let component: PatientManagerReportComponent;
  let fixture: ComponentFixture<PatientManagerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientManagerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientManagerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
