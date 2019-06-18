import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcrAssessmentComponent } from './bcr-assessment.component';

describe('BcrAssessmentComponent', () => {
  let component: BcrAssessmentComponent;
  let fixture: ComponentFixture<BcrAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcrAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcrAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
