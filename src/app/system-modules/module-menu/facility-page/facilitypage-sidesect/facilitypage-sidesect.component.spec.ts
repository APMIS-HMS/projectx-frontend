import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitypageSidesectComponent } from './facilitypage-sidesect.component';

describe('FacilitypageSidesectComponent', () => {
  let component: FacilitypageSidesectComponent;
  let fixture: ComponentFixture<FacilitypageSidesectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitypageSidesectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitypageSidesectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
