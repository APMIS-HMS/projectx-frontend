import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLandingBillingComponent } from './patient-landing-billing.component';

describe('PatientLandingBillingComponent', () => {
  let component: PatientLandingBillingComponent;
  let fixture: ComponentFixture<PatientLandingBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientLandingBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLandingBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
