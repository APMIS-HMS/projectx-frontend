import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExitComponent } from './product-exit.component';

describe('ProductExitComponent', () => {
  let component: ProductExitComponent;
  let fixture: ComponentFixture<ProductExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
