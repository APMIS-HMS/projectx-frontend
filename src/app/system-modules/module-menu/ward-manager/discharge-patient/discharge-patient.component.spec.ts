import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargePatientComponent } from './discharge-patient.component';

describe('DischargePatientComponent', () => {
  let component: DischargePatientComponent;
  let fixture: ComponentFixture<DischargePatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DischargePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
