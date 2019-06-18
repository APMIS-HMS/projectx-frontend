import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTagsComponent } from './patient-tags.component';

describe('PatientTagsComponent', () => {
  let component: PatientTagsComponent;
  let fixture: ComponentFixture<PatientTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
