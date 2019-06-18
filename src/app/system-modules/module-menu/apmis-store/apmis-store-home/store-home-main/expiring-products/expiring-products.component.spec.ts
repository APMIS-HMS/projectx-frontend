import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringProductsComponent } from './expiring-products.component';

describe('ExpiringProductsComponent', () => {
  let component: ExpiringProductsComponent;
  let fixture: ComponentFixture<ExpiringProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiringProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
