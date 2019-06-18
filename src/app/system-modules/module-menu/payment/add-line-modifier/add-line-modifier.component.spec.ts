/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddLineModifierComponent } from './add-line-modifier.component';

describe('AddLineModifierComponent', () => {
  let component: AddLineModifierComponent;
  let fixture: ComponentFixture<AddLineModifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineModifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
