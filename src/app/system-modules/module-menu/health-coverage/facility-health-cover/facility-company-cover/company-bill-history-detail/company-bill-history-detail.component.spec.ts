import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBillHistoryDetailComponent } from './company-bill-history-detail.component';

describe('CompanyBillHistoryDetailComponent', () => {
  let component: CompanyBillHistoryDetailComponent;
  let fixture: ComponentFixture<CompanyBillHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBillHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBillHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
