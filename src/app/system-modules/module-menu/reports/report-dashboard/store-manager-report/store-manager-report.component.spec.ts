import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerReportComponent } from './store-manager-report.component';

describe('StoreManagerReportComponent', () => {
  let component: StoreManagerReportComponent;
  let fixture: ComponentFixture<StoreManagerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
