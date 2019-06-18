import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildImmunizationComponent } from './child-immunization.component';

describe('ChildImmunizationComponent', () => {
  let component: ChildImmunizationComponent;
  let fixture: ComponentFixture<ChildImmunizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildImmunizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
