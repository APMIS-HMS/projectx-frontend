import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUploadViewComponent } from './doc-upload-view.component';

describe('DocUploadViewComponent', () => {
  let component: DocUploadViewComponent;
  let fixture: ComponentFixture<DocUploadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocUploadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
