import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisSearchResultComponent } from './apmis-search-result.component';

describe('ApmisSearchResultComponent', () => {
  let component: ApmisSearchResultComponent;
  let fixture: ComponentFixture<ApmisSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
