import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMovementComponent } from './product-movement.component';

describe('ProductMovementComponent', () => {
  let component: ProductMovementComponent;
  let fixture: ComponentFixture<ProductMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
