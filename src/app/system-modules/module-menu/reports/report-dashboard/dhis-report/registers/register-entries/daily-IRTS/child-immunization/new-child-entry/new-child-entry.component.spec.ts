import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChildEntryComponent } from './new-child-entry.component';

describe('NewChildEntryComponent', () => {
  let component: NewChildEntryComponent;
  let fixture: ComponentFixture<NewChildEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChildEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChildEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
