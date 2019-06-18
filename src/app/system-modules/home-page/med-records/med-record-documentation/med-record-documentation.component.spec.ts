import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRecordDocumentationComponent } from './med-record-documentation.component';

describe('MedRecordDocumentationComponent', () => {
  let component: MedRecordDocumentationComponent;
  let fixture: ComponentFixture<MedRecordDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRecordDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRecordDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
