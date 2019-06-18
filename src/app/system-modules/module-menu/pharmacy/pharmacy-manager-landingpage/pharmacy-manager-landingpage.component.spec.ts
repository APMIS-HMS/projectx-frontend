import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyManagerLandingpageComponent } from './pharmacy-manager-landingpage.component';

describe('PharmacyManagerLandingpageComponent', () => {
  let component: PharmacyManagerLandingpageComponent;
  let fixture: ComponentFixture<PharmacyManagerLandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyManagerLandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyManagerLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
