import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoOfficerComponent } from './hmo-officer.component';

describe('HmoOfficerComponent', () => {
  let component: HmoOfficerComponent;
  let fixture: ComponentFixture<HmoOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
