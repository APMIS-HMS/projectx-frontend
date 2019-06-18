import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPurchaseOrderComponent } from './no-purchase-order.component';

describe('NoPurchaseOrderComponent', () => {
  let component: NoPurchaseOrderComponent;
  let fixture: ComponentFixture<NoPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
