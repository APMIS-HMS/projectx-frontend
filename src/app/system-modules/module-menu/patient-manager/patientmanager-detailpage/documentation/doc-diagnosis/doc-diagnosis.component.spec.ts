import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDiagnosisComponent } from './doc-diagnosis.component';

describe('DocDiagnosisComponent', () => {
  let component: DocDiagnosisComponent;
  let fixture: ComponentFixture<DocDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
