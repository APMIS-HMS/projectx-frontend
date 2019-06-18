import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyReportComponent } from './pharmacy-report.component';

describe('PharmacyReportComponent', () => {
  let component: PharmacyReportComponent;
  let fixture: ComponentFixture<PharmacyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
