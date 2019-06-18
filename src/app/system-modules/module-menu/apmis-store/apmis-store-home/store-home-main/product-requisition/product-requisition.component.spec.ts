import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRequisitionComponent } from './product-requisition.component';

describe('ProductRequisitionComponent', () => {
  let component: ProductRequisitionComponent;
  let fixture: ComponentFixture<ProductRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
