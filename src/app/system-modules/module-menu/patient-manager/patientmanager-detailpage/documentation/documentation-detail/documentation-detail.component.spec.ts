import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationDetailComponent } from './documentation-detail.component';

describe('DocumentationDetailComponent', () => {
  let component: DocumentationDetailComponent;
  let fixture: ComponentFixture<DocumentationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
