import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPatientComponent } from './transfer-patient.component';

describe('TransferPatientComponent', () => {
  let component: TransferPatientComponent;
  let fixture: ComponentFixture<TransferPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
