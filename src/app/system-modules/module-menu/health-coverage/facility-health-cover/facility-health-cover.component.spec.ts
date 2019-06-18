import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityHealthCoverComponent } from './facility-health-cover.component';

describe('FacilityHealthCoverComponent', () => {
  let component: FacilityHealthCoverComponent;
  let fixture: ComponentFixture<FacilityHealthCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityHealthCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityHealthCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
