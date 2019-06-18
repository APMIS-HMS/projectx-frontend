import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUploadDetailComponent } from './doc-upload-detail.component';

describe('DocUploadDetailComponent', () => {
  let component: DocUploadDetailComponent;
  let fixture: ComponentFixture<DocUploadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocUploadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
