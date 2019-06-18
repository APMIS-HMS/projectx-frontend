import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalPrescriptionComponent } from './external-prescription.component';

describe('ExternalPrescriptionComponent', () => {
  let component: ExternalPrescriptionComponent;
  let fixture: ComponentFixture<ExternalPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
