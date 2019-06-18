import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundTransferComponent } from './inbound-transfer.component';

describe('InboundTransferComponent', () => {
  let component: InboundTransferComponent;
  let fixture: ComponentFixture<InboundTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
