import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodataPopupComponent } from './biodata-popup.component';

describe('BiodataPopupComponent', () => {
  let component: BiodataPopupComponent;
  let fixture: ComponentFixture<BiodataPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiodataPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiodataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
