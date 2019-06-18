import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreChartComponentComponent } from './store-chart-component.component';

describe('StoreChartComponentComponent', () => {
  let component: StoreChartComponentComponent;
  let fixture: ComponentFixture<StoreChartComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreChartComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
