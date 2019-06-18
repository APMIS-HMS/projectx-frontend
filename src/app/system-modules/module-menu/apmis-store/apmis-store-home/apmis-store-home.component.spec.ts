import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisStoreHomeComponent } from './apmis-store-home.component';

describe('ApmisStoreHomeComponent', () => {
  let component: ApmisStoreHomeComponent;
  let fixture: ComponentFixture<ApmisStoreHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisStoreHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisStoreHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
