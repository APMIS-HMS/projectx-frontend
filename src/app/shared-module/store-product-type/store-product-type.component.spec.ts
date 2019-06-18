import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductTypeComponent } from './store-product-type.component';

describe('StoreProductTypeComponent', () => {
  let component: StoreProductTypeComponent;
  let fixture: ComponentFixture<StoreProductTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProductTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
