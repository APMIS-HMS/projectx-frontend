import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordPaymentComponent } from './med-record-payment.component';

describe('MedRecordPaymentComponent', () => {
  let component: MedRecordPaymentComponent;
  let fixture: ComponentFixture<MedRecordPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
