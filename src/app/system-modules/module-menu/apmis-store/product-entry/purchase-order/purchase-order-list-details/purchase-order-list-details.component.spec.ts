import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderListDetailsComponent } from './purchase-order-list-details.component';

describe('PurchaseOrderListDetailsComponent', () => {
  let component: PurchaseOrderListDetailsComponent;
  let fixture: ComponentFixture<PurchaseOrderListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
