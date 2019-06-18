import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSymptomComponent } from './doc-symptom.component';

describe('DocSymptomComponent', () => {
  let component: DocSymptomComponent;
  let fixture: ComponentFixture<DocSymptomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSymptomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSymptomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
