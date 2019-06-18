import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisSearchComponent } from './apmis-search.component';

describe('ApmisSearchComponent', () => {
  let component: ApmisSearchComponent;
  let fixture: ComponentFixture<ApmisSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
