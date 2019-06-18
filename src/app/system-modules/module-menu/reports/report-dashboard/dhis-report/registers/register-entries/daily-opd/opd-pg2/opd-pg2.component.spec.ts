import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdPg2Component } from './opd-pg2.component';

describe('OpdPg2Component', () => {
  let component: OpdPg2Component;
  let fixture: ComponentFixture<OpdPg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdPg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdPg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
