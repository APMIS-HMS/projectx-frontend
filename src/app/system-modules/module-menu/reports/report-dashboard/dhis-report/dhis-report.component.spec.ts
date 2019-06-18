import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhisReportComponent } from './dhis-report.component';

describe('DhisReportComponent', () => {
  let component: DhisReportComponent;
  let fixture: ComponentFixture<DhisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DhisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
