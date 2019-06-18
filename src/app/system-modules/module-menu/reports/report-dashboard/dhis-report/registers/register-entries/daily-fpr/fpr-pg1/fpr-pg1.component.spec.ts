import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FprPg1Component } from './fpr-pg1.component';

describe('FprPg1Component', () => {
  let component: FprPg1Component;
  let fixture: ComponentFixture<FprPg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FprPg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FprPg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
