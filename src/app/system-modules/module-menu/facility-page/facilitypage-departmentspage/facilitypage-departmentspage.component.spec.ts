/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacilitypageDepartmentspageComponent } from './facilitypage-departmentspage.component';

describe('FacilitypageDepartmentspageComponent', () => {
  let component: FacilitypageDepartmentspageComponent;
  let fixture: ComponentFixture<FacilitypageDepartmentspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitypageDepartmentspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitypageDepartmentspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
