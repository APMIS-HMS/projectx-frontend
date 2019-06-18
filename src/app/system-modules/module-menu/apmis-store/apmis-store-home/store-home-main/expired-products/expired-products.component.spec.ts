import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredProductsComponent } from './expired-products.component';

describe('ExpiredProductsComponent', () => {
  let component: ExpiredProductsComponent;
  let fixture: ComponentFixture<ExpiredProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
