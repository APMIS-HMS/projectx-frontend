import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatementPlanComponent } from './treatement-plan.component';

describe('TreatementPlanComponent', () => {
  let component: TreatementPlanComponent;
  let fixture: ComponentFixture<TreatementPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatementPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatementPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
