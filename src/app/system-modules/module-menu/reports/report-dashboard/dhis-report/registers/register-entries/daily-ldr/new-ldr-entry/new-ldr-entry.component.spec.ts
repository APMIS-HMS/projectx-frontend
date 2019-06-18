import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLdrEntryComponent } from './new-ldr-entry.component';

describe('NewLdrEntryComponent', () => {
  let component: NewLdrEntryComponent;
  let fixture: ComponentFixture<NewLdrEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLdrEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLdrEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
