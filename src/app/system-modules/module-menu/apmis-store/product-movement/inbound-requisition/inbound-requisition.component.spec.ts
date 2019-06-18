import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundRequisitionComponent } from './inbound-requisition.component';

describe('InboundRequisitionComponent', () => {
  let component: InboundRequisitionComponent;
  let fixture: ComponentFixture<InboundRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
