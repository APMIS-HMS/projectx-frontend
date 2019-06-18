import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOpdEntry2Component } from './new-opd-entry2.component';

describe('NewOpdEntry2Component', () => {
  let component: NewOpdEntry2Component;
  let fixture: ComponentFixture<NewOpdEntry2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOpdEntry2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOpdEntry2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
