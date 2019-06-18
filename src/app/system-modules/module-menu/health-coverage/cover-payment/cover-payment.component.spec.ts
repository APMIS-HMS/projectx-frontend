import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPaymentComponent } from './cover-payment.component';

describe('CoverPaymentComponent', () => {
  let component: CoverPaymentComponent;
  let fixture: ComponentFixture<CoverPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
