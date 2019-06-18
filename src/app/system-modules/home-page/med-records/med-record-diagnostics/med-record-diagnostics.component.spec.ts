import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordDiagnosticsComponent } from './med-record-diagnostics.component';

describe('MedRecordDiagnosticsComponent', () => {
  let component: MedRecordDiagnosticsComponent;
  let fixture: ComponentFixture<MedRecordDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
