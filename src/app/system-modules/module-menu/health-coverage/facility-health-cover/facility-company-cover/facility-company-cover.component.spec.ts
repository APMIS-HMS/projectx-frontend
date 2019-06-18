import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityCompanyCoverComponent } from './facility-company-cover.component';

describe('FacilityCompanyCoverComponent', () => {
  let component: FacilityCompanyCoverComponent;
  let fixture: ComponentFixture<FacilityCompanyCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityCompanyCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityCompanyCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
