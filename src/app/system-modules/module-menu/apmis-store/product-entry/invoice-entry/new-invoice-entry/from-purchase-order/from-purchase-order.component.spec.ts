import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromPurchaseOrderComponent } from './from-purchase-order.component';

describe('FromPurchaseOrderComponent', () => {
  let component: FromPurchaseOrderComponent;
  let fixture: ComponentFixture<FromPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
