import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievePaymentComponent } from './recieve-payment.component';

describe('RecievePaymentComponent', () => {
  let component: RecievePaymentComponent;
  let fixture: ComponentFixture<RecievePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecievePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecievePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
