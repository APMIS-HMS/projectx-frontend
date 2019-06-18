import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEntryLineItemComponent } from './invoice-entry-line-item.component';

describe('InvoiceEntryLineItemComponent', () => {
  let component: InvoiceEntryLineItemComponent;
  let fixture: ComponentFixture<InvoiceEntryLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceEntryLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEntryLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
