import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterEntryComponent } from './new-register-entry.component';

describe('NewRegisterEntryComponent', () => {
  let component: NewRegisterEntryComponent;
  let fixture: ComponentFixture<NewRegisterEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
