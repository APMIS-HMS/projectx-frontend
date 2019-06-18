import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStockDetailsComponent } from './receive-stock-details.component';

describe('ReceiveStockDetailsComponent', () => {
  let component: ReceiveStockDetailsComponent;
  let fixture: ComponentFixture<ReceiveStockDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveStockDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
