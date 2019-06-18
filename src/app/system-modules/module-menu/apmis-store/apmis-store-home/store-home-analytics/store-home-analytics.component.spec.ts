import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHomeAnalyticsComponent } from './store-home-analytics.component';

describe('StoreHomeAnalyticsComponent', () => {
  let component: StoreHomeAnalyticsComponent;
  let fixture: ComponentFixture<StoreHomeAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreHomeAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreHomeAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
