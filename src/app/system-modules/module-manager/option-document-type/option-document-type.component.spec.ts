import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDocumentTypeComponent } from './option-document-type.component';

describe('OptionDocumentTypeComponent', () => {
  let component: OptionDocumentTypeComponent;
  let fixture: ComponentFixture<OptionDocumentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
