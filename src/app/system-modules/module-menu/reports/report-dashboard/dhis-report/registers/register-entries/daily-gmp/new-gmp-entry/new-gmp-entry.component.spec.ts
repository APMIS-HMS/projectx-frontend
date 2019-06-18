import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGmpEntryComponent } from './new-gmp-entry.component';

describe('NewGmpEntryComponent', () => {
  let component: NewGmpEntryComponent;
  let fixture: ComponentFixture<NewGmpEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGmpEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGmpEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
