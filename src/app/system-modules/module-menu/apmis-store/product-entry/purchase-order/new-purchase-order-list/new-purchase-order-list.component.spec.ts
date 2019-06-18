import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseOrderListComponent } from './new-purchase-order-list.component';

describe('NewPurchaseOrderListComponent', () => {
  let component: NewPurchaseOrderListComponent;
  let fixture: ComponentFixture<NewPurchaseOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPurchaseOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPurchaseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
