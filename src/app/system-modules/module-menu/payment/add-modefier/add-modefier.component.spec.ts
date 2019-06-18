/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddModefierComponent } from './add-modefier.component';

describe('AddModefierComponent', () => {
  let component: AddModefierComponent;
  let fixture: ComponentFixture<AddModefierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModefierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModefierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
