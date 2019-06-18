import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPrescriptionComponent } from './bill-prescription.component';

describe('BillPrescriptionComponent', () => {
  let component: BillPrescriptionComponent;
  let fixture: ComponentFixture<BillPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
