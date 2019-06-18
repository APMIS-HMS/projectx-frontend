import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisStoreProductComponent } from './apmis-store-product.component';

describe('ApmisStoreProductComponent', () => {
  let component: ApmisStoreProductComponent;
  let fixture: ComponentFixture<ApmisStoreProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisStoreProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisStoreProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
