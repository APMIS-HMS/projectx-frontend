import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteManagerComponent } from './route-manager.component';

describe('RouteManagerComponent', () => {
  let component: RouteManagerComponent;
  let fixture: ComponentFixture<RouteManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
