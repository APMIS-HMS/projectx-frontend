import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyRequestsComponent } from './radiology-requests.component';

describe('LabRequestsComponent', () => {
  let component: RadiologyRequestsComponent;
  let fixture: ComponentFixture<RadiologyRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
