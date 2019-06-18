import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDiscountComponent } from './pos-discount.component';

describe('PosDiscountComponent', () => {
  let component: PosDiscountComponent;
  let fixture: ComponentFixture<PosDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
