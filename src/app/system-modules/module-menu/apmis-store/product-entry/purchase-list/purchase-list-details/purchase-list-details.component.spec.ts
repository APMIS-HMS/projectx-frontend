import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListDetailsComponent } from './purchase-list-details.component';

describe('PurchaseListDetailsComponent', () => {
  let component: PurchaseListDetailsComponent;
  let fixture: ComponentFixture<PurchaseListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
