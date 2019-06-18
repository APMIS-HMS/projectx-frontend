import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisNewStoreComponent } from './apmis-new-store.component';

describe('ApmisNewStoreComponent', () => {
  let component: ApmisNewStoreComponent;
  let fixture: ComponentFixture<ApmisNewStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisNewStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisNewStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
