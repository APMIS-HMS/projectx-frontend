import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordPrescriptionComponent } from './med-record-prescription.component';

describe('MedRecordPrescriptionComponent', () => {
  let component: MedRecordPrescriptionComponent;
  let fixture: ComponentFixture<MedRecordPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
