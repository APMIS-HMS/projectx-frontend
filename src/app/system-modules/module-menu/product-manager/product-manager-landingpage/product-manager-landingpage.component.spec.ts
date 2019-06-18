import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerLandingpageComponent } from './product-manager-landingpage.component';

describe('ProductManagerLandingpageComponent', () => {
  let component: ProductManagerLandingpageComponent;
  let fixture: ComponentFixture<ProductManagerLandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManagerLandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagerLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
