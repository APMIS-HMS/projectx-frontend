import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAntenatalEntryComponent } from './new-antenatal-entry.component';

describe('NewAntenatalEntryComponent', () => {
  let component: NewAntenatalEntryComponent;
  let fixture: ComponentFixture<NewAntenatalEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAntenatalEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAntenatalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
