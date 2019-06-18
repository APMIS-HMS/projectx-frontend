import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisStoreSupplierSearchComponent } from './apmis-store-supplier-search.component';

describe('ApmisStoreSupplierSearchComponent', () => {
  let component: ApmisStoreSupplierSearchComponent;
  let fixture: ComponentFixture<ApmisStoreSupplierSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisStoreSupplierSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisStoreSupplierSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
