import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBillDetailComponent } from './company-bill-detail.component';

describe('CompanyBillDetailComponent', () => {
  let component: CompanyBillDetailComponent;
  let fixture: ComponentFixture<CompanyBillDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBillDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
