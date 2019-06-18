import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntenatalPg1Component } from './antenatal-pg1.component';

describe('AntenatalPg1Component', () => {
  let component: AntenatalPg1Component;
  let fixture: ComponentFixture<AntenatalPg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntenatalPg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntenatalPg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
