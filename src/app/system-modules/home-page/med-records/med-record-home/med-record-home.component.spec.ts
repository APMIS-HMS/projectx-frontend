import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordHomeComponent } from './med-record-home.component';

describe('MedRecordHomeComponent', () => {
  let component: MedRecordHomeComponent;
  let fixture: ComponentFixture<MedRecordHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
