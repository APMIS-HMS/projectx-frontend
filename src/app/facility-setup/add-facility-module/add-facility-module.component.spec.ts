import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacilityModuleComponent } from './add-facility-module.component';

describe('AddFacilityModuleComponent', () => {
  let component: AddFacilityModuleComponent;
  let fixture: ComponentFixture<AddFacilityModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFacilityModuleComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacilityModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
