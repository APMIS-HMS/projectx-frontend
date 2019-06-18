import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundTransferComponent } from './outbound-transfer.component';

describe('OutboundTransferComponent', () => {
  let component: OutboundTransferComponent;
  let fixture: ComponentFixture<OutboundTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
