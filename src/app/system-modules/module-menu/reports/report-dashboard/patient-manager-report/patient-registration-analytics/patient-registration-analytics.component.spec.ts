import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistrationAnalyticsComponent } from './patient-registration-analytics.component';

describe('PatientRegistrationAnalyticsComponent', () => {
  let component: PatientRegistrationAnalyticsComponent;
  let fixture: ComponentFixture<PatientRegistrationAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegistrationAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegistrationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
