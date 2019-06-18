import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSalesReportComponent } from './store-sales-report.component';

describe('StoreSalesReportComponent', () => {
  let component: StoreSalesReportComponent;
  let fixture: ComponentFixture<StoreSalesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSalesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
