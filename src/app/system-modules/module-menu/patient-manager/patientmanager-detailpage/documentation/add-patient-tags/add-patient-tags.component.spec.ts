import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientTagsComponent } from './add-patient-tags.component';

describe('AddPatientTagsComponent', () => {
  let component: AddPatientTagsComponent;
  let fixture: ComponentFixture<AddPatientTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
