import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFprEntryComponent } from './new-fpr-entry.component';

describe('NewFprEntryComponent', () => {
  let component: NewFprEntryComponent;
  let fixture: ComponentFixture<NewFprEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFprEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFprEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
