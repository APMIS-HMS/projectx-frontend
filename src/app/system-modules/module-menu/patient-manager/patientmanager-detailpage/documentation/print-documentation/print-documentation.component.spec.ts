import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDocumentationComponent } from './print-documentation.component';

describe('PrintDocumentationComponent', () => {
  let component: PrintDocumentationComponent;
  let fixture: ComponentFixture<PrintDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
