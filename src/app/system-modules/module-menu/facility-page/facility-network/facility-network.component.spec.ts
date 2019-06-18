import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityNetworkComponent } from './facility-network.component';

describe('FacilityNetworkComponent', () => {
  let component: FacilityNetworkComponent;
  let fixture: ComponentFixture<FacilityNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
