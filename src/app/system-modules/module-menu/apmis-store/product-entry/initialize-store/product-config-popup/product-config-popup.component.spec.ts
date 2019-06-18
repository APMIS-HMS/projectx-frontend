import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigPopupComponent } from './product-config-popup.component';

describe('ProductConfigPopupComponent', () => {
  let component: ProductConfigPopupComponent;
  let fixture: ComponentFixture<ProductConfigPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductConfigPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
