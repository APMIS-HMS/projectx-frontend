import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRadiologyReportComponent } from './view-radiology-report.component';

describe('ViewRadiologyReportComponent', () => {
  let component: ViewRadiologyReportComponent;
  let fixture: ComponentFixture<ViewRadiologyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRadiologyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRadiologyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
