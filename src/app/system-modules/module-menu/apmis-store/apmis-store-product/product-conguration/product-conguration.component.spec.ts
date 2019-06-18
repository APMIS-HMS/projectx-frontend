import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCongurationComponent } from './product-conguration.component';

describe('ProductCongurationComponent', () => {
  let component: ProductCongurationComponent;
  let fixture: ComponentFixture<ProductCongurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCongurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCongurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});