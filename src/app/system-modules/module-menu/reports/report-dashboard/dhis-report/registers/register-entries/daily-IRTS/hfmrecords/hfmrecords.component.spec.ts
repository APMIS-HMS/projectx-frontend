import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HfmrecordsComponent } from './hfmrecords.component';

describe('HfmrecordsComponent', () => {
  let component: HfmrecordsComponent;
  let fixture: ComponentFixture<HfmrecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HfmrecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HfmrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
