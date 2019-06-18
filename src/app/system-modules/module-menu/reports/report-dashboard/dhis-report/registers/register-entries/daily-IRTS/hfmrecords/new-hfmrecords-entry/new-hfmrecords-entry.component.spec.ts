import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHfmrecordsEntryComponent } from './new-hfmrecords-entry.component';

describe('NewHfmrecordsEntryComponent', () => {
  let component: NewHfmrecordsEntryComponent;
  let fixture: ComponentFixture<NewHfmrecordsEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHfmrecordsEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHfmrecordsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
