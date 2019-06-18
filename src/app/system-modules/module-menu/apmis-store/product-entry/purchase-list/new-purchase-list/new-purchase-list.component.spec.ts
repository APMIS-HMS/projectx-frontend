import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseListComponent } from './new-purchase-list.component';

describe('NewPurchaseListComponent', () => {
  let component: NewPurchaseListComponent;
  let fixture: ComponentFixture<NewPurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPurchaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
