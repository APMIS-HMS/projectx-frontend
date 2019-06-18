import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckProductDistributionComponent } from './check-product-distribution.component';

describe('CheckProductDistributionComponent', () => {
  let component: CheckProductDistributionComponent;
  let fixture: ComponentFixture<CheckProductDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckProductDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckProductDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
