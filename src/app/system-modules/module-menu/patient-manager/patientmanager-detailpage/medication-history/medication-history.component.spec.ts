import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationHistoryComponent } from './medication-history.component';

describe('MedicationHistoryComponent', () => {
  let component: MedicationHistoryComponent;
  let fixture: ComponentFixture<MedicationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
