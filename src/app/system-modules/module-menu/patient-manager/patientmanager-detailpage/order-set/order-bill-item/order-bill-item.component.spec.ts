import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBillItemComponent } from './order-bill-item.component';

describe('OrderBillItemComponent', () => {
  let component: OrderBillItemComponent;
  let fixture: ComponentFixture<OrderBillItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBillItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBillItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
