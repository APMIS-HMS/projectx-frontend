import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineDocumentationComponent } from './vaccine-documentation.component';

describe('VaccineDocumentationComponent', () => {
  let component: VaccineDocumentationComponent;
  let fixture: ComponentFixture<VaccineDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccineDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
