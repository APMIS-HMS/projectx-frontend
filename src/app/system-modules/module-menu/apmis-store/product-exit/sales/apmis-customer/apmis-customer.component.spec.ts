import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisCustomerComponent } from './apmis-customer.component';

describe('ApmisCustomerComponent', () => {
  let component: ApmisCustomerComponent;
  let fixture: ComponentFixture<ApmisCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
