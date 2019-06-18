import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyComponent } from './radiology.component';

describe('LabComponent', () => {
  let component: RadiologyComponent;
  let fixture: ComponentFixture<RadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
