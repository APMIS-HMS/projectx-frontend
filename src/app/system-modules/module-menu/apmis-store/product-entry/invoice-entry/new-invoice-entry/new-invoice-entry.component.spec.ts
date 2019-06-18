import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoiceEntryComponent } from './new-invoice-entry.component';

describe('NewInvoiceEntryComponent', () => {
  let component: NewInvoiceEntryComponent;
  let fixture: ComponentFixture<NewInvoiceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInvoiceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInvoiceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
