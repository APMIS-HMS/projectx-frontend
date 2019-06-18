import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdPg1Component } from './opd-pg1.component';

describe('OpdPg1Component', () => {
  let component: OpdPg1Component;
  let fixture: ComponentFixture<OpdPg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdPg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdPg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
