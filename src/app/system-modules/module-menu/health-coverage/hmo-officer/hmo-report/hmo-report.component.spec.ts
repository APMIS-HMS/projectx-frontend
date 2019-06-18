import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoReportComponent } from './hmo-report.component';

describe('HmoReportComponent', () => {
  let component: HmoReportComponent;
  let fixture: ComponentFixture<HmoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
