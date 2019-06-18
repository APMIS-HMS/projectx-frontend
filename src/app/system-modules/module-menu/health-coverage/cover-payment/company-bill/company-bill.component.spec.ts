import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBillComponent } from './company-bill.component';

describe('CompanyBillComponent', () => {
  let component: CompanyBillComponent;
  let fixture: ComponentFixture<CompanyBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
