import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownPatientMergeComponent } from './unknown-patient-merge.component';

describe('UnknownPatientMergeComponent', () => {
  let component: UnknownPatientMergeComponent;
  let fixture: ComponentFixture<UnknownPatientMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnknownPatientMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnknownPatientMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
