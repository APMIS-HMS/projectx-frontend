import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPrescriptionComponent } from './customer-prescription.component';

describe('CustomerPrescriptionComponent', () => {
  let component: CustomerPrescriptionComponent;
  let fixture: ComponentFixture<CustomerPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
