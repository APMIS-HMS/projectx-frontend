import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerReportComponent } from './ward-manager-report.component';

describe('WardManagerReportComponent', () => {
  let component: WardManagerReportComponent;
  let fixture: ComponentFixture<WardManagerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
