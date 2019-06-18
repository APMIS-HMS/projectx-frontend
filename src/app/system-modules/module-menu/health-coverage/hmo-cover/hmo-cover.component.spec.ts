/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HmoCoverComponent } from './hmo-cover.component';

describe('HmoCoverComponent', () => {
  let component: HmoCoverComponent;
  let fixture: ComponentFixture<HmoCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
