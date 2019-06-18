import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityFamilyCoverComponent } from './facility-family-cover.component';

describe('FacilityFamilyCoverComponent', () => {
  let component: FacilityFamilyCoverComponent;
  let fixture: ComponentFixture<FacilityFamilyCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityFamilyCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFamilyCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
