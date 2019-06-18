import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLandingpageComponent } from './dashboard-landingpage.component';

describe('DashboardLandingpageComponent', () => {
  let component: DashboardLandingpageComponent;
  let fixture: ComponentFixture<DashboardLandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
