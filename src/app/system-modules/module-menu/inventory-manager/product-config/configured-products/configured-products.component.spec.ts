import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredProductsComponent } from './configured-products.component';

describe('ConfiguredProductsComponent', () => {
  let component: ConfiguredProductsComponent;
  let fixture: ComponentFixture<ConfiguredProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguredProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
