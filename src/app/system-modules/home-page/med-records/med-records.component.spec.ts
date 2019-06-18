import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordsComponent } from './med-records.component';

describe('MedRecordsComponent', () => {
  let component: MedRecordsComponent;
  let fixture: ComponentFixture<MedRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
