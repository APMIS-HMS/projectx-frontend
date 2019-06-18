import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensePrescriptionComponent } from './dispense-prescription.component';

describe('DispensePrescriptionComponent', () => {
  let component: DispensePrescriptionComponent;
  let fixture: ComponentFixture<DispensePrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispensePrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
