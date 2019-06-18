import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistersComponent } from './patient-registers.component';

describe('PatientRegistersComponent', () => {
  let component: PatientRegistersComponent;
  let fixture: ComponentFixture<PatientRegistersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegistersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
