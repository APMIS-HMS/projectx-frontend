import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRadiologyReportComponent } from './new-radiology-report.component';

describe('NewRadiologyReportComponent', () => {
  let component: NewRadiologyReportComponent;
  let fixture: ComponentFixture<NewRadiologyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRadiologyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRadiologyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
