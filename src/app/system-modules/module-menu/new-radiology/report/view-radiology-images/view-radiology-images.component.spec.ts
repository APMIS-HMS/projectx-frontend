import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRadiologyImagesComponent } from './view-radiology-images.component';

describe('ViewRadiologyImagesComponent', () => {
  let component: ViewRadiologyImagesComponent;
  let fixture: ComponentFixture<ViewRadiologyImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRadiologyImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRadiologyImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
