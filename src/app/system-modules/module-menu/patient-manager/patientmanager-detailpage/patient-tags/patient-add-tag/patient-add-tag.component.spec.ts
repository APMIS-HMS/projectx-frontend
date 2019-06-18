import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddTagComponent } from './patient-add-tag.component';

describe('PatientAddTagComponent', () => {
  let component: PatientAddTagComponent;
  let fixture: ComponentFixture<PatientAddTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAddTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
