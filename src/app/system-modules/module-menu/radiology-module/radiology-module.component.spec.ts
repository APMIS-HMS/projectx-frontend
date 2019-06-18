import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyModuleComponent } from './radiology-module.component';

describe('RadiologyModuleComponent', () => {
  let component: RadiologyModuleComponent;
  let fixture: ComponentFixture<RadiologyModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
