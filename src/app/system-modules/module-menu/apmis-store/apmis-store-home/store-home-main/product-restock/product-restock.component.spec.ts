import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRestockComponent } from './product-restock.component';

describe('ProductRestockComponent', () => {
  let component: ProductRestockComponent;
  let fixture: ComponentFixture<ProductRestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
