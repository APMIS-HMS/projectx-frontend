import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPatientPrescriptionComponent } from './new-patient-prescription.component';

describe('NewPatientPrescriptionComponent', () => {
  let component: NewPatientPrescriptionComponent;
  let fixture: ComponentFixture<NewPatientPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPatientPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPatientPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
