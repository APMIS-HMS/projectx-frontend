import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntenatalPg2Component } from './antenatal-pg2.component';

describe('AntenatalPg2Component', () => {
  let component: AntenatalPg2Component;
  let fixture: ComponentFixture<AntenatalPg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntenatalPg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntenatalPg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
