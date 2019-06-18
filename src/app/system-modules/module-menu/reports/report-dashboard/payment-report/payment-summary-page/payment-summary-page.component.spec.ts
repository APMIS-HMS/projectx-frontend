import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryPageComponent } from './payment-summary-page.component';

describe('PaymentSummaryPageComponent', () => {
  let component: PaymentSummaryPageComponent;
  let fixture: ComponentFixture<PaymentSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
