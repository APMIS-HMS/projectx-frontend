import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListDetailsComponent } from './invoice-list-details.component';

describe('InvoiceListDetailsComponent', () => {
  let component: InvoiceListDetailsComponent;
  let fixture: ComponentFixture<InvoiceListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
