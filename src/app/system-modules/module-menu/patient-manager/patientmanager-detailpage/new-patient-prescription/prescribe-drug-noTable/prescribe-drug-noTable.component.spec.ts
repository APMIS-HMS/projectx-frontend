import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribeDrugComponent } from './prescribe-drug-noTable.component';

describe('PrescribeDrugComponent', () => {
  let component: PrescribeDrugComponent;
  let fixture: ComponentFixture<PrescribeDrugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescribeDrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescribeDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
