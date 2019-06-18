import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInvestigationComponent } from './bill-investigation.component';

describe('BillInvestigationComponent', () => {
  let component: BillInvestigationComponent;
  let fixture: ComponentFixture<BillInvestigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillInvestigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
