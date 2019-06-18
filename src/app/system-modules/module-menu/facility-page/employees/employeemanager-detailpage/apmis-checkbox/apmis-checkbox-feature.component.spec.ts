/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApmisCheckboxFeatureComponent } from './apmis-checkbox-feature.component';

describe('ApmisCheckboxFeatureComponent', () => {
  let component: ApmisCheckboxFeatureComponent;
  let fixture: ComponentFixture<ApmisCheckboxFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisCheckboxFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisCheckboxFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
