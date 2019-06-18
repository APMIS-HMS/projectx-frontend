import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAddItemComponent } from './bill-add-item.component';

describe('BillAddItemComponent', () => {
  let component: BillAddItemComponent;
  let fixture: ComponentFixture<BillAddItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAddItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
