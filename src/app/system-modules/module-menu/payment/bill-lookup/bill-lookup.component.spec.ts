/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BillLookupComponent } from './bill-lookup.component';

describe('BillLookupComponent', () => {
  let component: BillLookupComponent;
  let fixture: ComponentFixture<BillLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
