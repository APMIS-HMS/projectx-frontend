import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateImgComponent } from './update-img.component';

describe('UpdateImgComponent', () => {
  let component: UpdateImgComponent;
  let fixture: ComponentFixture<UpdateImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
