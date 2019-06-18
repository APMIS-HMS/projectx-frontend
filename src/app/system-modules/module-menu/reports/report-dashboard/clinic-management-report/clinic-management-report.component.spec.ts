import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicManagementReportComponent } from './clinic-management-report.component';

describe('ClinicManagementReportComponent', () => {
  let component: ClinicManagementReportComponent;
  let fixture: ComponentFixture<ClinicManagementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicManagementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicManagementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
