import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreStoresComponent } from './store-stores.component';

describe('StoreStoresComponent', () => {
  let component: StoreStoresComponent;
  let fixture: ComponentFixture<StoreStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
