import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientProblemComponent } from './add-patient-problem.component';

describe('AddPatientProblemComponent', () => {
  let component: AddPatientProblemComponent;
  let fixture: ComponentFixture<AddPatientProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientProblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
