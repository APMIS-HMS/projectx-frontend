import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateMedicationComponent } from './template-medication.component';

describe('TemplateMedicationComponent', () => {
  let component: TemplateMedicationComponent;
  let fixture: ComponentFixture<TemplateMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateMedicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
