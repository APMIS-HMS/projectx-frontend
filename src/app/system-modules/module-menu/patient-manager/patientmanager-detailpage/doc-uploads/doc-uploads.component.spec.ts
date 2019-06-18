import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUploadsComponent } from './doc-uploads.component';

describe('DocUploadsComponent', () => {
  let component: DocUploadsComponent;
  let fixture: ComponentFixture<DocUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
