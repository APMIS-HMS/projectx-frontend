import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOpdEntryComponent } from './new-opd-entry.component';

describe('NewOpdEntryComponent', () => {
  let component: NewOpdEntryComponent;
  let fixture: ComponentFixture<NewOpdEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOpdEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOpdEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
