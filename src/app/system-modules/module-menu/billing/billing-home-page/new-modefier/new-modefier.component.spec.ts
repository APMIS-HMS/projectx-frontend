/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewModefierComponent } from './new-modefier.component';

describe('NewModefierComponent', () => {
  let component: NewModefierComponent;
  let fixture: ComponentFixture<NewModefierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModefierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModefierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
