import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';

describe('ApmisStoreLandingpageComponent', () => {
  let component: ApmisStoreLandingpageComponent;
  let fixture: ComponentFixture<ApmisStoreLandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisStoreLandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisStoreLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
