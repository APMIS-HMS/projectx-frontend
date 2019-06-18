import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionBillComponent } from './prescription-bill.component';

describe('PrescriptionBillComponent', () => {
  let component: PrescriptionBillComponent;
  let fixture: ComponentFixture<PrescriptionBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
